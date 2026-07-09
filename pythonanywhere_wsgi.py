# WSGI entry point I use to run this app on PythonAnywhere.
# On the Web tab I set the WSGI file to point here; PythonAnywhere looks for a
# callable named `application`, which is just my Flask app from app.py.

import sys

# Where I cloned the project on the server.
project_home = '/home/Askal/journal'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from app import app as application
