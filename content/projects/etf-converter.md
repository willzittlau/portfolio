---
title: "ETF Converter"
createdAt: "2020-09-15"
description: "Convert a portfolio of ETFs into individual holdings using Flask and pandas"
img: "https://raw.githubusercontent.com/willzittlau/ETFSite/master/demo.gif"
alt: "Gif of app example"
featured: "no"
tags:
  - python
  - coding
  - projects
  - flask
  - pandas
---

#### For a live demo, check out <a>https://etfconverter.herokuapp.com/</a>

This was my first fully featured web-app that I developed. Prior to this I had made some basic static HTML/CSS only projects, and lots of Java/Python projects in the terminal, but had yet to put them all together on a personal project. A little backstory for this comes in the wake of the COVID-19 outbreak, when stock markets were racing their way to the bottom. I had been very passive and had a financial advisor do all of my investing, and this sudden shock was the impetus needed for me to actually inspect my finances. Long story short I'm now a DIY investor, and do a lot of my investments through ETFs to get broader exposure to the market. However, I still hold some individual stocks, and I was wanting to know what my actual exposure to individual holdings is when summing the input from various ETFs. For example, if you held a tech ETF as well as something like QQQ for broad exposure to the Nasdaq, they both would hold MSFT, AAPL, etc etc. Add that on top of if you individually held some shares of these companies, and suddenly you don't know your true exposure anymore.

Google searching came up with nothing. Lots of sites which will take a stock and return which ETF's contain them with their weight, but nothing that sums up an entire portfolio. Next I thought about making an excel spreadsheet, but that would be extremely laborious. Then I thought about automating it with a Python script! I use Yahoo Finance to keep track of my investments on mobile, which ended up being convenient as it allows you to export your holdings as a .csv. This is extra convenient as it also allows for a standardized input for scaling the app to other user's as well. It started off just running as a command line program, where I would stick my .csv in the same directory as the .py file, and grew from there. Pandas is used to manage all of the data, and imports the .csv with the `pd.read_csv()` module and Beautiful Soup scrapes the holdings. The first step was separate out Canadian and US equities. In Yahoo Finance, all Canadian equities are their ticker, followed by '.TO' or '.V' . I use the exchange rates API to get a live exchange rate. 

```python
     # Seperate Cdn and US equities by defining str
     cdn1 = '.TO'
     cdn2 = '.V'
     # Define live currency exchange
     r = requests.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=CAD')
     j = r.json()
     x = float(j['rates']['CAD'])
     # US/CAD Current Price calculation
     for i in range(0,len(pf['Current Price'])):
     # I assume here if current price exists then a symbol does as well
     # if .TO is not in symbol OR .V is not in symbol, then
          if not cdn1 in pf.at[i,'Symbol'] or cdn2 in pf.at[i,'Symbol']:
          # update price based on exchange rate
               pf.at[i,'Current Price'] = x * pf.at[i,'Current Price']
```

Next is scraping the ETFs for their inner holdings. This is the meat of the app, and also unfortunately the most prone to breaking if the site providers ever change their structure. I started off by scraping Yahoo Finance themselves, but they only return the top 10 holdings. I later updated to ycharts which returns the top 25. To do this, you just pass the ticker column through a loop into a standard URL format for whatever you're scraping from and use BS4 to return the table containing the holdings. Append this to a master list, rinse and repeat. At the end you'll have a mess of data, but it contains everything we need.  I use a try statement here, because the page structure for individual holdings will be different than that of an ETF. If the scrape fails, it means it was an individual stock and that we should move onto the next ticker. Large user inputs could take 30+s because of individual scraping. which wasn't ideal. To get around this, I harnessed asynchronous tasks using the grequests module. This way I can send multiple requests at once. On my personal portfolio I was using for tests, I brought the processing time down from 40 seconds to 6.

```python
# This function pulls the URLs which will be scraped from
def get_URLs(input_data):
    # Initialize empty return variables
    urls = list()
    # Make new DF of symbol column to pull URLs from
    pf = pd.DataFrame(input_data, columns= ['Symbol'])
    for i in range(0,len(pf['Symbol'])):
        # Format symbol column for webscraping
        pf.at[i, 'Symbol'] = pf.at[i, 'Symbol'].replace("-",".")
        # Get URL list
        url = ('https://ycharts.com/companies/%s' % pf.at[i, 'Symbol'])
        urls.append(url)
    return urls
```

```python
# This function converts the input data into the list of holdings and weightings from the ETF Tickers
def convert(urls, pf):
    # Create empty list of etf holdings
    etf_lib = list()
    # Async requests
    reqs = [grequests.get(url) for url in urls]
    resp = grequests.map(reqs)
    # Parse data tables with pandas and append data to return variable
    for i, r in enumerate(resp):
        get_text = r.text
        try:
            wds=pd.read_html(get_text)[1]
        # This statement skips equities so the scraper can pull ETF data only
        except:
            pass
        else:
            # Logic explained in next section
```

In the loop the logic gets a bit tricky. Basically, we take the original dataframe, and iterate through each row. If the row contains an ETF, we append the scraped data to a new list. We then should delete this row from the original dataframe, as the holdings have been accounted for. However, before we do this we need to remember that these sites are only returning the top x holdings, which means there is still y value of unaccounted for holdings left in the ETF. We handle this by subtracting the sum from the value of holdings that were scraped, and then adding this result back to the original data frame with a 'Misc' notation in the name. Once the loop has completed, we first concatenate the list of dataframes together into one large dataframe. Next, we append the original portfolio dataframe to this, as this portfolio now only contains individual holdings and the misc values left in the ETFs. Finally, we take advantage of pandas' `.groupby` and `sum()` functions. This will group all values in the dataframe by a specified column (We'll use the ticker column), and then sums together all values from rows which share the same column value declared by the `.groupby`. We now have the resultant portfolio of individual holdings!

```python
# Continuing loop above
		else:
        	# Change scraped data format to match that of YF columns from import
            wds = wds.rename(columns={"%\xa0Weight": "% Weight", "%\xa0Change" : "% Chg"})
            # Filter col of interest and convert '% Weight' col from str to float, format Symbol col
            for j in range(0,len(wds['% Weight'])):
                wds.at[j, '% Weight'] = wds.at[j, '% Weight'].replace("%","")
                wds.at[j, 'Symbol'] = wds.at[j, 'Symbol'].replace("-",".")
            wds['% Weight'] = wds['% Weight'].astype(float)
            # Delete unused data
            del wds['Price']
            del wds['% Chg']
            # Create MISC ticker which represents the % holding of the ETF not accouted for by top 25 holdings
            etft= 100 - wds['% Weight'].sum()
            new_row= {'Symbol':(pf.at[i, 'Symbol']), '% Weight':etft}
            wds = wds.append(new_row, ignore_index=True)
            # Multiply ETF ticker list by weight in portfolio
            wds['% Weight'] = wds['% Weight'] * pf.at[i, '% Weight']
            # Append to list of ETF data and remove ETF ticker from list and remove original ticker entry after it has been parsed
            etf_lib.append(wds)
            pf.drop([i], inplace=True)
    # Concatenate lists together and sum any repeat tickers in list
    df = pd.concat(etf_lib)
    pf['% Weight'] *= 100
    df = df.append(pf)
    # This command will combine repeat tickers and sum their values, but doing so deletes the Name col
    df = df.groupby(['Symbol'] , as_index=False).sum()
    # Final sorted variable containing output
    out = df.sort_values(by = '% Weight', ascending=False)
```

One caveat of the `sum()` function is that any string value will also be concatenated. Therefore if MSFT showed up three times, the name column would now read 'MicrosoftMicrosoftMicrosoft'. To get around this, I created a new list which only contains name values which we remove prior to the sum function, and then inject them back in after the summation.  However this created a new problem, the length of the columns change as the summation removes rows. Therefore, my name data wasn't lining up. Using a dictionary with key:value pairs using the ticker and name solved this.

```python
# Create names dict prior to summation
names = dict(zip(df['Symbol'], df['Name']))
# Correct name column to values saved in names dictionary
for i in range(0,len(out['Symbol'])):
    for j in names.keys():
        if str(j) == str(out.at[i, 'Symbol']):
            out.at[i, 'Name'] = names.get(j)
# Re-add ETF Names
for i in range(0,len(out['Symbol'])):
    for j in etfnames.keys():
        if str(j) in str(out.at[i, 'Symbol']):
            out.at[i, 'Name'] = ('Misc ' + str(etfnames.get(j)) + ' Holdings')
```

At this point I now had a program that worked in the terminal. Great, but I wanted to make this a useable service. And so, I started learning Flask! I love how intuitive it is and quick to pick up, and you can create an app in literally 10 lines of code. I ended up with three routes, the index page for uploading, a user printout validating what they uploaded (If you're interested in this you can check the source code), and a download path for the resulting .csv. I used flask-dropzone to handle the user upload form. The skeleton structure looks something like this:

```python
# Import libraries
import os
from flask import Flask, render_template, request, make_response, url_for, send_from_directory
from flask_dropzone import Dropzone
from script import get_URLs, namescrape, print_input, convert
# Create an app instance
app = Flask(__name__)
dropzone = Dropzone(app)
# Update app configuration
app.config.update (
    #UPLOAD_FOLDER = '.\\uploads', # Commented out to test
    UPLOAD_FOLDER = '/tmp',
    # Flask-Dropzone config:
    DROPZONE_ALLOWED_FILE_CUSTOM = True,
    DROPZONE_ALLOWED_FILE_TYPE='.csv',
    DROPZONE_MAX_FILES=1,
    DROPZONE_REDIRECT_VIEW= "download")
# Main page
@app.route("/", methods =['GET', 'POST'])
def index():
    if request.method == 'POST':
        #Take CSV input
        filename = 'quotes.csv'
        input_file = request.files.get('file')
        input_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # Return template
    return render_template('index.html')
# Download page
@app.route("/download")
def download():
    # Initialize empty variables for Jinja
    table = ''
    total = ''
    # Read Uploaded data
    input_data = pd.read_csv('/tmp/quotes.csv')
    # Get URLs for scraping
    get_URLs_list = get_URLs(input_data)
    urls = get_URLs_list[0]
    urls2 = get_URLs_list[1]
    # Get Name Data
    names = namescrape(urls)
    # Get data from upload
    userdata = print_input(input_data, names)
    # Store variables
    table = userdata[0]
    total = userdata[1]
    etfnames = userdata[2]
    pf = userdata[3]
    pft = userdata[4]
    # Convert CSV and download result
    output_data = convert(urls2, pf, pft, etfnames)
    output = output_data.to_csv('/tmp/result.csv', index=False)
    # Return template and variables
    return render_template('download.html', table=table, total = total, filename='result.csv')
# Download result route
@app.route("/output/<filename>")
def output(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
# On running server.py, run Flask app
if __name__ == "__main__":
    # Still under development, run debug
    app.run(debug=True)
```

```jinja2
    <!--Generate page content-->
    {% if table %}
        <div align = "center">
            <style scoped="">
                .button-large {
                font-size: 150%;
            }
            </style>
            <a href="{{ url_for('output', filename=filename) }}"><button class="button-large pure-button">
                <i class="fa fa-download"></i> Download Result
            </button></a>
            <br> or <br>
            <a href="{{ url_for('index') }}"><button class="pure-button"> Return Home
            </button></a>
        </div>
        <div class = "summary">
            <h3> This is a summary of what you uploaded: </h3>
            <b>The total portfolio value in $CAD is: {{total}} </b>
        </div>
        <div class = "pure-table pure-table-horizontal" align = "center">
            {{table|safe}}
        </div>
    {% endif %}
```

And voila! For the HTML basically Jinja creates some dynamic functionality by using an `{% if %}` statement on the return variables, so that part of the page content is hidden until the data is generated. Otherwise its pretty basic HTML/CSS but it's functional and doesn't look too bad. I launched it to Heroku, and took advantage of their ephemeral file system to temporaily store the user result. Currently not a very scalable solution, but it works perfectly on the single dyno included with the free plan. There's a gif of the working demo below, and if you've made it reading this far the entire source code is available at https://github.com/willzittlau/ETFSite. Thanks for reading!

![GIF of app example](https://raw.githubusercontent.com/willzittlau/ETFSite/master/demo.gif)