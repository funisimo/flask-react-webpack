Sample Python with Flask and FastApi server side
React webpacked on client side mix

On server we have Python
And on Application side we have React
As DB we use GoogleCloud

Quick setup guide for server side:
Ensure python3 is on your system (3.12 and up)

## Install OpenJDK

Install Java JDK (I recommend **OpenJDK 11** from [AdoptOpenJDK](https://adoptopenjdk.net/)) - this is needed to run the 
Datastore or Firestore emulator (via Cloud SDK).


## Install Cloud SDK

Install [Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts).

## Install Cloud SDK components

Make sure you have the following Cloud SDK components installed:

- Cloud SDK Core Libraries (core)
- gcloud app Python Extensions (app-engine-python)
- gcloud app Python Extensions - Extra Libraries (app-engine-python-extras)
- gcloud Beta Commands (beta)

If you'll use Datastore or Firestore, you'll need to install one of these (or both) components too:

- Cloud Datastore Emulator (cloud-datastore-emulator)
- Cloud Firestore Emulator (cloud-firestore-emulator)

More docs: https://cloud.google.com/sdk/docs/components

Install dependancies: 
```pip install -r requirements.txt```

navigate to `react-app` folder to install react dependancies
with: ```npm i```

To run application:
```python3 run.py```

