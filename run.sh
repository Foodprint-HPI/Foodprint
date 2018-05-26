#!/bin/bash

export PYTHONPATH=$PYTHONPATH:$PWD

gunicorn server.app:app -t 3000 --log-file=-
