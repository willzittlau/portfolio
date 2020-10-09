---
title: "Rogers Pass SMS Notifications"
createdAt: "2020-09-17"
description: "Flask + Twilio App launched to Heroku"
img: ""
alt: "Rogers Pass SMS"
featured: "no"
tags:
  - python
  - coding
  - flask
  - twilio
  - projects
---

This was the next project I worked on after ETF converter. I'm an avid backcountry skier, and Rogers Pass is one of the best areas on the planet for it. It's in Glacier National Park, and Park's Canada has set up a winter permit system to allow skiers access while Parks can still do highway avalanche control. As such, they have created a permit system almost like a season's pass to allow for skiing after users have taken a test on the control measures and understand the rules. Basically, every morning they open or close areas based on perceived avalanche risk with potential for affecting the highway, or closures for daily avalanche control. These areas are updated at approximately 8am daily, and can be accessed on the Government of Canada website or by calling their toll-free number. However, when day-tripping from Kelowna, generally the areas update just as you are entering the park or looking for parking (depending on when you left in the morning, 5am starts are pretty typical), where service can be spotty. Similarly, if you are coming in earlier, you may already be skinning up before the areas have updated (A great example is leaving from the discovery center - an unrestricted area, but hoping to ski Roger's Run, which is within a restricted area). In both of these cases, whether clicking through the website to the updated page or calling the number, it's inconvenient. So, I figured it wouldn't be hard to set up an app which actively scrapes the daily updates, formats it into a text friendly message, and notifies whoever signs up for the day. 

Enter Twilio. If you don't know, Twilio is a really easy to use service which allows two way communication between an application and a phone. I decided SMS updates would be the simplest, and started plugging away at making an interface with a Flask app. The UI ended up bring pretty simple, just a single static page, with error and success messages being handled by Jinja and Flask message flashing. To store the data, I used Postgres to save the phone numbers and daily messages to text out. With python, this is pretty easy using SQLAlchemy. Combine that with the Twilio API and Selenium/pandas for scraping the Government of Canada site to save data (They use js to load everything so just scraping with Beautiful Soup and requests doesn't work) and that's basically all of the packages we need. 

Initializing the db:

```python
from app import db

# Add dB tables
class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String())
    date_time = db.Column(db.DateTime())
    signup_date = db.Column(db.Date())
    def __init__(self, number, date_time, signup_date):
        self.number = number
        self.date_time = date_time
        self.signup_date = signup_date
    def __repr__(self):
        return '<id {}>'.format(self.id)

class Info(db.Model):
    __tablename__ = 'Info'
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Text())
    status_date = db.Column(db.Date())
    def __init__(self, status, status_date):
        self.status = status
        self.status_date = status_date
    def __repr__(self):
        return '<id {}>'.format(self.id)
```

And the Flask app, setting up Twilio and our route (using environment variables):

```python
# Import libraries
import os
from flask import Flask, render_template, request, url_for, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from selenium import webdriver
import pandas as pd
import datetime
import time

# Set up app and environment
app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
os.environ['TZ'] = 'UTC'
time.tzset()

# Create dB
db = SQLAlchemy(app)

# Set up Twilio
account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
client = Client(account_sid, auth_token)

# Home Page
@app.route("/", methods =['GET', 'POST'])
def index():
    # Set dummy variable for Jinja and dB entry
    postsuccess = ''
    # POST request route
    if request.method == 'POST':
        # Get data from form and fill dB variables
        number_in = request.form.get('number')
        signup_date = datetime.datetime.utcnow().date()
        posttime = datetime.datetime.utcnow()
        date_time = datetime.datetime(
                            posttime.year, posttime.month, 
                            posttime.day, posttime.hour, 
                            posttime.minute, posttime.second
                                )
        # Verify number and prevent incorrect form entries
        num_regex = re.findall(r'''[^a-zA-Z@$&%!=:;/|}{#^*_\\><,?"']''', number_in)
        number_out = ''.join(num_regex)
        # Format to e.164 for dB entry
        number = format_e164(number_out)
        if is_valid_number(number) and number != '':
            # Check if user has already signed up for the udpate or not
            if db.session.query(User).filter(
                    and_(User.number == number, User.signup_date == signup_date)).count() == 0:
                # Append to dB
                data = User(number, date_time, signup_date)
                db.session.add(data)
                db.session.commit()
                # Update Jinja variable
                postsuccess = 'posted'
        # Redirects with error flash
            else:
                flash('This number has already been signed up for tomorrow\'s update!', 'error')
                return redirect(url_for('index'))
        else:
            flash('Error: Phone number doesn\'t exist or incorrect format. Please try again!', 'error')
            return redirect(url_for('index'))
    # Return template
    return render_template('index.html', postsuccess=postsuccess)

# On running app.py, run Flask app
if __name__ == "__main__":
    app.run(debug=True)
```

Next are the functions, where we need a web scraper which will save the daily update and add it to our database, one which will verify user inputs and add them to our database, and finally one which will query the database and send an SMS to users.  I decided on making it so that if you sign up it will only text you the following morning once. In the future I think a more logical method would be using the site interface to initially sign up, and then after that enable two way texting, so that users can just subscribe and unsubscribe to daily updates with 'Yes' and 'No' text messages. For now, if you want to receive updates every day you will have to sign up every night. 

Webscraping (This also formats the the data into a SMS friendly output). An ultra simple way for getting past sites which use js packages to render HTML is to add a short delay. Since this function isn't time sensitive, I just added `time.sleep(3)` which will give it 3 seconds to load before scraping the HTML after requesting the page. Not elegant, but it's simple and works well.

```python
# Webscrape data and add to dB
def webscrape():
    # Selenium init
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = os.environ['GOOGLE_CHROME_PATH']
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(executable_path=os.environ['CHROMEDRIVER_PATH'], chrome_options=chrome_options)
    # Scrape
    driver.get('https://www.pc.gc.ca/apps/rogers-pass/print?lang=en')
    time.sleep(3)
    page_source = driver.page_source
    driver.quit()
    # Save data
    tables = pd.read_html(page_source)
    wra_table = pd.DataFrame(tables[0])
    parking_table = pd.DataFrame(tables[1])
    prohibited_table = pd.DataFrame(tables[2])
    # Initialise strings
    title_string = 'Status for ' + str(datetime.datetime.utcnow().date()) + ':'
    wra_open_string = 'Open WRAs: '
    wra_closed_string = 'Closed WRAs: '
    parking_open_string = 'Open Parking: '
    parking_closed_string = 'Closed Parking: '
    prohibited_string = 'Prohibited Areas: '
    # String concatenation for WRA table
    for i in range (0, len(wra_table['Winter restricted area'])):
        if wra_table.at[i, 'Status'].startswith('O'):
            wra_table.at[i, 'Status'] = wra_table.at[i, 'Status'][:4]
            wra_open_string += (wra_table.at[i, 'Winter restricted area'] + ', ')
        if wra_table.at[i, 'Status'].startswith('C'):
            wra_table.at[i, 'Status'] = wra_table.at[i, 'Status'][:6]
            wra_closed_string += wra_table.at[i, 'Status'] + '\n'
    if not wra_open_string.endswith(': '):
        wra_open_string = wra_open_string[:-2]
    if not wra_closed_string.endswith(': '):
        wra_closed_string = wra_closed_string[:-2]
    # String concatenation for Parking table
    for i in range (0, len(parking_table['Parking area'])):
        parking_table.at[i,'Parking area'] = parking_table.at[i,'Parking area'].replace(' Parking', '')
        if parking_table.at[i, 'Status'].startswith('O'):
            parking_table.at[i, 'Status'] = parking_table.at[i, 'Status'][:4]
            parking_open_string += (parking_table.at[i, 'Parking area'] + ', ')
        if parking_table.at[i, 'Status'].startswith('C'):
            parking_table.at[i, 'Status'] = parking_table.at[i, 'Status'][:6]
            parking_closed_string += parking_table.at[i, 'Status'] + '\n'
    if not parking_open_string.endswith(': '):
        parking_open_string = parking_open_string[:-2]
    if not parking_closed_string.endswith(': '):
        parking_closed_string = parking_closed_string[:-2]
    # String concatenation for Prohibited table
    for i in range (0, len(prohibited_table['Winter prohibited area'])):
        prohibited_string += (prohibited_table.at[i, 'Winter prohibited area'] + ', ')
    if not prohibited_string.endswith(': '):
        prohibited_string = prohibited_string[:-2]
    # Concat and save results for dB
    status = (title_string + '\n' + wra_open_string 
                + '\n' + wra_closed_string + '\n' + parking_open_string 
                + '\n' + parking_closed_string + '\n' + prohibited_string)
    status_date = datetime.datetime.utcnow().date()
    # Append to dB
    rpdata = Info(status, status_date)
    db.session.add(rpdata)
    db.session.commit()
```

I used the Twilio API to verify phone numbers. I noticed that it doesn't catch all exceptions, so I also made a regex that filters the input first into E.164 format (Twilio's default) before sending it to their client lookup (There's a million stack overflow posts about phone number regex's so it won't be included here)

```python
# Twilio number verification
def is_valid_number(number):
    try:
        response = client.lookups.phone_numbers(number).fetch(type="carrier")
        return True
    except TwilioRestException as e:
        if e.code == 20404:
            return False
```

And finally sending messages. The logic here is to first query the database to return today's message, followed by a query which a date filter to return who we should send that message to.

```python
# Send SMS
def send_sms():
    # Return contents for sms message
    todays_date = datetime.datetime.utcnow().date()
    daily_update_sms = db.session.query(Info.status).filter(Info.status_date == todays_date).limit(1).scalar()
    daily_update_sms = daily_update_sms.replace('\n', '\n\n')
    # Find list of numbers to send sms to
    query_end_time = datetime.datetime.combine(datetime.datetime.utcnow().date(), datetime.time(15, 5))
    query_start_time = query_end_time - datetime.timedelta(days = 1)
    daily_numbers = db.session.query(User.number.distinct()).filter(
                                        and_(User.date_time >= query_start_time, 
                                            User.date_time <= query_end_time)).all()
    daily_numbers = [r for r, in daily_numbers]
    for number in daily_numbers:
        message = client.messages.create(
                    from_= os.environ['TWILIO_NUMBER'],
                    to=number,
                    body=daily_update_sms)
```

As for the HTML, like I said earlier everything dynamic is generated through either message flashing or Jinja using variables with an `{% if %}` statement. Keeps the page static and simple, and does everything we need.

```jinja2
//index.html

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <title>Rogers Pass Status SMS</title>
    <link rel="stylesheet" type="text/css" href="{{ url_for('static', filename='style.css') }}">
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}">
    <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
</head>
<body>
    <div class="header-image">
    	<img src="{{ url_for('static', filename='rp.jpg') }}"/>
        <div class="header-text">
            <h1> Rogers Pass Winter Restricted Area Status SMS</h1>
        </div>
    </div>
    <h3>Enter your phone number in the form below to get an SMS status update tomorrow for the Rogers Pass Restricted Areas</h3>
    {% with messages = get_flashed_messages(with_categories=true) %}
        {% for category, message in messages %}
            <div class="{{ category }}">{{ message }}</div>
        {% endfor %}
    {% endwith %}
    {% if not postsuccess %}
        <style scoped="">
            .button-custom {
                border: 0.5px solid Silver;
                border-radius: 6px;
            }
        </style>
        <form class="pure-form" method="post" action="/">
            <input type="tel" class="pure-input-rounded" name="number" autocomplete= "tel" required placeholder="ex. 123-456-7890" >
            <button type="submit" class="button-custom pure-button">Submit</button>
        </form>
    {% endif %}
    {% if postsuccess %}
        <p><b>Success! You will be notified tomorrow just after 8AM.</b></p>
    {% endif %}
</body>
</html>
```

Finally, I launched the app to Heroku. You might be asking, how does the app know to scrape and text every morning? Well, I used the free Heroku task manager which is basically just a simple version of CRON, which first calls the scraper, followed by the send SMS function after the first function has completed. I have it so it runs daily at 8:05am. Overall, really quite simple but a fun look at how to integrate phone communication into an application. I'm stoked to use it this winter and streamline the morning route planning! You can see the source code [here](https://github.com/willzittlau/Rogers-Pass-SMS), or view it live at https://rogers-pass.herokuapp.com/. Thanks for reading!

