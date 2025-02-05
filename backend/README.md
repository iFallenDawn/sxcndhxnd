# FastAPI Backend

## Getting Started

Setup a [virtual environment](https://fastapi.tiangolo.com/virtual-environments/#create-a-virtual-environment)

### WSL Setup

Open remote WSL, clone repository in the Ubuntu distro.

```bash
cd server
python3 -m venv .venv
```
If you get an error trying to create the virtual environment, install [brew](https://brew.sh/) and then run
```bash
brew install python
```
Anytime you develop, activate the virtual environment
```bash
source .venv/bin/activate
```
Set Python interpreter to your venv
```
.venv/bin/python3.13

```
Install all the packages
```bash
pip3 install -r requirements.txt
```
Run the server
```bash
fastapi dev main.py
```
