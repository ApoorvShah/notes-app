from notesapp import app
from flask import Flask, request, redirect, render_template

notes = []


@app.route("/welcome")
def welcome():
    return "Hello World!"


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'note' in request.form:
            note = request.form['note']
            notes.append(note)
            write_notes_to_file()
            return redirect('/')
        elif 'delete' in request.form:
            index = int(request.form['delete'])
            delete_note(index)
            write_notes_to_file()
            return redirect('/')
        elif 'edit' in request.form:
            index = int(request.form['edit'])
            note = notes[index]
            delete_note(index)
            return render_template('edit.html', note=note, index=index)
    return render_template('index.html', notes=notes)


@app.before_first_request
def before_first_request():
    read_notes_from_file()


def write_notes_to_file():
    with open("notes.txt", "w") as f:
        for note in notes:
            f.write(note + "\n")


def read_notes_from_file():
    try:
        with open("notes.txt", "r") as f:
            for line in f:
                notes.append(line.strip())
    except FileNotFoundError:
        open("notes.txt", "w").close()


def delete_note(index):
    try:
        del notes[index]
    except IndexError:
        pass
