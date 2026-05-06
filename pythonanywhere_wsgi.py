# =============================================================================
# PythonAnywhere WSGI configuration TEMPLATE
# -----------------------------------------------------------------------------
# You do NOT run this file yourself. When you create a web app on
# PythonAnywhere (Web tab -> "Manual configuration" -> Flask/Python 3.10),
# PythonAnywhere creates a WSGI file for you at a path like:
#
#     /var/www/<username>_pythonanywhere_com_wsgi.py
#
# Open that file (there is an "edit" link on the Web tab), delete everything
# in it, and paste the code below. Change `askalthapa` to YOUR username and
# make sure the folder name matches where you uploaded/cloned the project.
# =============================================================================

import sys

# 1. Tell PythonAnywhere where the project code lives.
project_home = '/home/askalthapa/journal'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 2. Import the Flask app from app.py. PythonAnywhere expects the WSGI
#    callable to be named `application`.
from app import app as application
