---
title: "Ski Forecast API"
createdAt: "2020-09-18"
description: "CRUD API for Ski Forecast App"
img: ""
alt: "Ski Forecast API"
featured: "no"
tags:
  - projects
  - coding
  - python
  - flask
  - REST api
---

***This is post 1/2 in a two part project. to view the other half of this project click [here](#).***

After my first two Python projects,  I was reading more and more into skills I should focus on learning to become more employable as a jr developer. Naturally, REST APIs came up. I watched some tutorials, and understood the concept, but I was finding it hard to get motivated on projects without there being any use case. Then I thought of creating a ski forecast app. When I go skiing I check both the avalanche forecast as well as weather data, and thought why not combine both into a single app for personal use? Then, to integrate the API portion, I would save forecast areas to the API and then query that with the main app to return data and generate the site pages. Great! Sticking with what I knew, I started up another Flask app and integrated Postgres again as the database (through Heroku).

```python
# models.py
from api import db

class Areas(db.Model):
    __tablename__ = 'Areas'
    name = db.Column(db.String(), primary_key=True)
    coordinates = db.Column(db.String())
    avalanche_forecast = db.Column(db.String())
    area_type = db.Column(db.String())
    tz_info = db.Column(db.String())
    NAM_elevation = db.Column(db.String())
    HRDPS_elevation = db.Column(db.String())

    def __init__(self, name, coordinates, avalanche_forecast, area_type, tz_info, NAM_elevation, HRDPS_elevation):
        self.name = name
        self.coordinates = coordinates
        self.avalanche_forecast = avalanche_forecast
        self.area_type = area_type
        self.tz_info = tz_info
        self.NAM_elevation = NAM_elevation
        self.HRDPS_elevation = HRDPS_elevation

    def __repr__(self):
        return '<name: {}>'.format(self.name)
```

The hard part was deciding which variables I wanted to save for each area. For the weather forecast I am pulling data from SpotWX, which uses a standard URL format for area queries. Here I need the time zone, model name, and GPS coordinates to get a specific area.  The format looks like this: (this example is the URL for HDRPS in Vancouver, BC) `https://spotwx.com/products/grib_index.php?model=gem_lam_continental&lat=49.26038&lon=-123.11336&tz=America/Vancouver`.  The key string is 'model=<b>w</b>>&lat=<b>x</b>&lon=<b>y</b>&tz=<b>z</b>'. The two models I'm interested in are the 48 hour and 3.5 day forecasts, or HRDPS & NAM. These have different forecast elevations at the same GPS coordinates due to model accuracy, so those variables need to be saved as well. The Avalanche Canada data was a bit more straight forward. By inspecting the source of the Avalanche.ca page I was able to find out that they use a public API to generate the forecast on their page as well. My API would just save the forecast area used for their API. Some more digging and I found the query to return their areas.json file (example below) which has all the data I need for getting avy forecasts.  Interestingly, it looks like Parks Canada submits the forecast for areas in national parks while Avalanche Canada covers the rest. Similarly Quebec and Vancouver Island also have their own data. This makes it rather frustrating for pulling historical data, but luckily the "today's forecast" is standardized to the AvCan API. The only variable I need to save is the `"id"` value, as it is passed to a standard URL for the query.

```json
// AvCan API areas.json example
    {
        "banff-yoho-kootenay": {
            "name": "Banff, Yoho and Kootenay National Parks",
            "type": "parks",
            "url": "http://avalanche.pc.gc.ca/CAAML-eng.aspx?r=1&d=TODAY",
            "externalUrl": "http://avalanche.pc.gc.ca/bulletin-eng.aspx?r=1&d=TODAY",
            "forecastUrl": "/api/forecasts/banff-yoho-kootenay.json",
            "dangerIconUrl": "/api/forecasts/graphics/install-new-app.svg",
            "owner": "parks-canada",
            "centroid": [
                -116.1400038397089,
                51.36555750662057
            ],
            "id": "banff-yoho-kootenay"
        },
        "northwest-coastal": {
            "name": "Northwest Coastal",
            "type": "avalx",
            "url": "https://y6gukeprck.execute-api.us-west-2.amazonaws.com/Prod/forecast?r=16",
            "forecastUrl": "/api/forecasts/northwest-coastal.json",
            "dangerIconUrl": "/api/forecasts/graphics/install-new-app.svg",
            "owner": "avalanche-canada",
            "centroid": [
                -129.77716219345095,
                55.70031480370605
            ],
            "id": "northwest-coastal"
        }
    }
```

Great! The db is set up with all the data needed. Now, I just had to make the CRUD functionality of my API. this part wasn't too bad, I used Postman for testing and with some helpful tutorials I was up and running pretty quick. But first I added basic authorization and error handling through HTTP Auth (since we're returning data in JSON, we also want to return error codes in JSON format as well).

```python
# api.py
# libraries
from flask import Flask, jsonify, abort, request, make_response, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
import json
import os

# Initialize dB
db = SQLAlchemy(api)
from models import *

# Authentication
auth = HTTPBasicAuth()
@auth.get_password
def get_password(username):
    if username == os.environ['API_User']:
        return os.environ['API_KEY']
    return None

# JSONify error codes
@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)
@api.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)
@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)
@api.errorhandler(405)
def not_found(error):
    return make_response(jsonify( { 'error': 'Method not allowed' } ), 405)
```

After that it was just going through the CRUD acronym, starting with 'Create'

```python
# POST (create) area
@api.route('/api/v1/areas', methods = ['POST'])
@auth.login_required
def create_area():
    # Check post datatype
    if not request.get_json():
        abort(400)
    else:
        post = request.get_json()
        # Check keys are correct
        if "name" and "area_type" and "avalanche_forecast" and "coordinates" and "tz_info" and "NAM_elevation" and "HRDPS_elevation" in post:
            values = post.values()
            # Check key-value pairs aren't empty
            for val in values:
                if val == '':
                    abort(400)
            # Convert to dB strings
            name = post["name"]
            coordinates = post["coordinates"]
            avalanche_forecast = post["avalanche_forecast"]
            area_type = post["area_type"]
            tz_info = post["tz_info"]
            NAM_elevation = post["NAM_elevation"]
            HRDPS_elevation = post["HRDPS_elevation"]
            # Make sure name entry doesn't exist already
            if bool(Areas.query.filter_by(name=name).first()) == True:
                abort (400)
            # Add unique completed entry to dB
            else:
                data = Areas(name, coordinates, avalanche_forecast, area_type, tz_info, NAM_elevation, HRDPS_elevation)
                db.session.add(data)
                db.session.commit()
        else:
            abort(400)
    return jsonify( post ), 201
```

Followed by 'READ'

```python
# GET all areas
@api.route('/api/v1/areas', methods = ['GET'])
@auth.login_required
def get_areas():
    # Query dB for all rows and save as dict objects
    # Append to list and serve to user as JSON
    get = []
    areas = Areas.query.all()
    for area in areas:
        area_dict = area.__dict__
        del area_dict['_sa_instance_state']
        get.append(area_dict)
    return jsonify( get )

# GET specific area
@api.route('/api/v1/areas/<name>', methods = ['GET'])
@auth.login_required
def get_area(name):
    # Query dB for all rows and save as dict objects
    get = []
    areas = Areas.query.all()
    for area in areas:
        area_dict = area.__dict__
        del area_dict['_sa_instance_state']
        get.append(area_dict)
    # Check to see if name from URL request exists, and if so return info as JSON
    for dictionary in get:
        if str(name) == dictionary["name"]:
            return jsonify( dictionary )
    # Requested URL doesn't exist in dB
    else:
        abort (404)
```

Followed by 'Update'

```python
# PUT (create / modify) specific area
@api.route('/api/v1/areas/<name>', methods = ['PUT'])
@auth.login_required
def modify_area(name):
    # Check post datatype
    if not request.get_json():
        abort(400)
    else:
        put = request.get_json()
        # Check keys are correct
        if "name" and "area_type" and "avalanche_forecast" and "coordinates" and "tz_info" and "NAM_elevation" and "HRDPS_elevation" in put:
            values = put.values()
            # Check key-value pairs aren't empty
            for val in values:
                if val == '':
                    abort(400)
            # Convert to dB strings
            name = put["name"]
            coordinates = put["coordinates"]
            avalanche_forecast = put["avalanche_forecast"]
            area_type = put["area_type"]
            tz_info = put["tz_info"]
            NAM_elevation = put["NAM_elevation"]
            HRDPS_elevation = put["HRDPS_elevation"]
            # Check if name entry exists
            if bool(Areas.query.filter_by(name=name).first()) == True:
                # Modify selected area
                area = Areas.query.filter_by(name=name).first()
                area.name = name
                area.coordinates = coordinates
                area.avalanche_forecast = avalanche_forecast
                area.area_type = area_type
                area.tz_info = tz_info
                area.NAM_elevation = NAM_elevation
                area.HRDPS_elevation = HRDPS_elevation
                # Submit changes to dB
                db.session.commit()
            # Add entry to dB if it doesn't already exist
            else:
                data = Areas(name, coordinates, avalanche_forecast, area_type, tz_info, NAM_elevation, HRDPS_elevation)
                db.session.add(data)
                db.session.commit()
                return jsonify( put ), 201
        else:
            abort(400)
    return jsonify( put )
```

And finally, 'Delete'

```python
# DELETE specific area
@api.route('/api/v1/areas/<name>', methods = ['DELETE'])
@auth.login_required
# Check delete datatype
def delete_area(name):
    if not request.get_json():
        abort(400)
    # Check that contents of delete request match the url route
    delete = request.get_json()
    if delete["name"] == str(name):
        # Check that delete request name exists in dB and execute request
        if bool(Areas.query.filter_by(name=delete["name"]).first()) == True:
            db.session.delete(Areas.query.filter_by(name=delete["name"]).first())
            db.session.commit()
        else:
            abort (404)
    else:
        abort (400)
    return jsonify( delete )
```

And there we go! Fully functioning REST API using Flask and Postgres. I launched it on Heroku so that I can query it from anywhere. To edit my ski forecast app, all I have to do is send a request to my API using Postman, and voila! For example, this is the request I sent for creating the object for Mt Macpherson near Revelstoke.

```json
{
    "area_type": "backcountry",
    "avalanche_forecast": "south-columbia",
    "coordinates": "lat=50.93209&lon=-118.28742",
    "HRDPS_elevation": "1621m",
    "NAM_elevation": "1350m",
    "tz_info": "America/Vancouver",
    "name": "mt-macpherson"
}
```

Thanks for making it this far &#128522;! As always, the source code can be found [here](https://github.com/willzittlau/ski-forecast-api).