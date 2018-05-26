import React, { Component } from 'react';
import './Recorder.css';
import UIKit from 'uikit';

class Recorder extends Component {

  constructor(props) {
    super(props);
    this.startCamera = this.startCamera.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
    this.displayErrorMessage = this.displayErrorMessage.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.takeSnapshot = this.takeSnapshot.bind(this);
    this.sendPhoto = this.sendPhoto.bind(this);
    this.handleMealChange = this.handleMealChange.bind(this);
    this.availableMeals = ["Breakfast", "Lunch", "Coffee", "Dinner", "Other"];
    this.state = {
      errorMessage: "",
      meal: "Coffee",
      mealSelectionActive: true
    }
  }

  handleMealChange(newMeal) {
    this.setState({
      meal: newMeal
    });
  }

  componentDidMount() {
    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);


      if (!navigator.getMedia) {
        this.displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
      } else{

        // Request the camera.
        navigator.getMedia({
          video: true
        },

        // Success callback
        function(stream) {
          this.refs.cameraStream.src = window.URL.createObjectURL(stream);

          // Play the video element to start the stream.
          this.refs.cameraStream.play();
        }.bind(this),
        // Error Callback
        function(err){
          this.displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
        }.bind(this)
      );

    }
  }

  startCamera(event) {
    event.preventDefault();
    this.refs.startButton.classList.remove("visible")
    this.refs.cameraStream.play();
    this.showVideo();
  }

  displayErrorMessage(text) {
    this.setState({
      errorMessage: text
    });
  }

  takePhoto(event) {
    event.preventDefault();
    this.setState({
      mealSelectionActive: false
    });
    if (this.refs.sendPhoto.classList.contains("green")) {
      return
    }

    if (!this.refs.deletePhoto.classList.contains("disabled")) {
      if (this.refs.sendPhoto.classList.contains("red")) {
        this.refs.sendPhoto.classList.remove("red");
      }
      this.deletePhoto(null);
      return
    }

    const snap = this.takeSnapshot();

    // Show image.
    this.refs.image.setAttribute('src', snap);
    this.refs.image.classList.add("visible");

    // Enable delete and save buttons
    this.refs.deletePhoto.classList.remove("disabled");
    this.refs.sendPhoto.classList.remove("disabled");
    // Pause video playback of stream.
    this.refs.cameraStream.pause();
  }

  deletePhoto(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      mealSelectionActive: true
    });

    if (this.refs.deletePhoto.classList.contains("disabled")) {
      return
    }

    if (this.refs.sendPhoto.classList.contains("red")) {
      this.refs.sendPhoto.classList.remove("red");
    }

    if (this.refs.sendPhoto.classList.contains("green")) {
      return
    }

    // Hide image.
    this.refs.image.setAttribute('src', "");
    this.refs.image.classList.remove("visible");

    // Disable delete and save buttons
    this.refs.deletePhoto.classList.add("disabled");
    this.refs.sendPhoto.classList.add("disabled");

    // Resume playback of stream.
    this.refs.cameraStream.play();
  }

  showVideo(){
    // Display the video stream and the controls.
    this.refs.cameraStream.classList.add("visible");
    this.refs.controls.classList.add("visible");
  }

  takeSnapshot() {
    // Here we're using a trick that involves a hidden canvas element.

    const hidden_canvas = this.refs.canvas,
    context = hidden_canvas.getContext('2d');

    const width = this.refs.cameraStream.videoWidth,
    height = this.refs.cameraStream.videoHeight;

    if (width && height) {

      // Setup a canvas with the same dimensions as the video.
      hidden_canvas.width = width;
      hidden_canvas.height = height;

      // Make a copy of the current frame in the video on the canvas.
      context.drawImage(this.refs.cameraStream, 0, 0, width, height);

      // Turn the canvas image into a dataURL that can be used as a src for our photo.
      return hidden_canvas.toDataURL('image/png');
    }
  }

  sendPhoto() {
    const imageSrc = this.refs.image.src;
    var blobBin = atob(imageSrc.split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
    console.log(file);

    var data = new FormData();
    data.append('photo', file);
    data.append('meal', this.state.meal);

    fetch('https://veggiefy.herokuapp.com/api/v1/upload/', {
      method: 'POST',
      body: data
    }).then(response => {
      console.log(response);
      if (response.status === 201) {
        this.refs.deletePhoto.classList.add("disabled");
        this.refs.sendPhoto.classList.add("green");
      } else {
        this.refs.sendPhoto.classList.add("red");
      }
    }).catch(error => {
      console.error('Error:', error);
      this.refs.sendPhoto.classList.add("red");
    })
  }

  render() {

    return (
      <div style={{"height": "calc(100vh - 80px)", "display": "flex", "alignItems": "center", "width": "100%"}}>
      <div className="app container">
          <div className="uk-inline" style={{width: "100%"}}>
        <button className="uk-button uk-button-default" type="button" style={{width: "100%", marginBottom: "10px"}}>{this.state.meal}</button>
        {this.state.mealSelectionActive && <div uk-dropdown="pos: bottom-justify">
            <ul className="uk-nav uk-dropdown-nav">
            {this.availableMeals.map((meal, key) => {
              if (this.state.meal === meal) {
                return <li key= {key} className="uk-active"><a href="#" onClick={() => this.handleMealChange(meal)}>{meal}</a></li>
              } else {
                return <li key={key}><a href="#" onClick={() => this.handleMealChange(meal)}>{meal}</a></li>
              }
            })}
            </ul>
        </div>}
    </div>

      <a href="#" id="start-camera" className="visible" onClick={this.startCamera} ref="startButton">Touch here to start the camera.</a>
      <div style={{"position": "relative"}}>
      <video id="camera-stream" ref="cameraStream"></video>
      <img ref="image" id="snap" />
      </div>
      <div style={{"position": "relative"}}>
      <div className="controls" ref="controls">
      <a href="#" id="delete-photo" title="Delete Photo" className="disabled" onClick={this.deletePhoto} ref="deletePhoto"><i className="far fa-trash-alt"></i></a>
      <a href="#" id="take-photo" title="Take Photo" onClick={this.takePhoto} ref="takePhoto"><i className="fas fa-camera"></i></a>
      <a href="#" id="send-photo" title="Save to Cloud" className="disabled" onClick={this.sendPhoto} ref="sendPhoto"><i className="fas fa-upload"></i></a>
      </div>
      <canvas ref="canvas"></canvas>
      </div>
      <div style={{"position": "relative"}}>
      <div ref="errorMessage" id="error-message">
      {this.state.errorMessage}
      </div>
      </div>
      </div>
      </div>
    );
  }
}

export default Recorder;
