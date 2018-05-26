#!/bin/bash

export PYTHONPATH=$PYTHONPATH:$PWD/server

gunicorn server.app:app --log-file=-
