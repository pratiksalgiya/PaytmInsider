import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImage: null,
      ImageValidationPassed: true,
      ImageValidationFailed: false,
      dimensionArray: [
        {
          id: "horizontal",
          height: 755,
          width: 450
        },
        {
          id: "vertical",
          height: 365,
          width: 450
        },
        {
          id: "horizontal-small",
          height: 365,
          width: 212
        },
        {
          id: "gallery",
          height: 380,
          width: 380
        }
      ]
    }
  }

  handleChange = (event) => {
    if (event.target.files[0]) {
      this.setState({
        selectedImage: URL.createObjectURL(event.target.files[0]),
      })
      this.readImageFile(event.target.files[0]);
    }
  }

  readImageFile(file) {
    var reader = new FileReader(); // CREATE AN NEW INSTANCE.
    reader.onload = (e) => {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = imageValidation;
      img.src = e.target.result;
      var thisRef = this;

      //Validating image dimensions and displaying it in 4 different cropped images
      function imageValidation() {
        var imageWidth = this.width;
        var imageHeight = this.height;
        if (imageWidth === 1024 && imageHeight === 1024) {

         thisRef.state.dimensionArray.forEach(imgDimensions => {
            cropPlusExport(img, imgDimensions.id, imgDimensions.height, imgDimensions.width);
          });

          // Creating the divs only when the validation is successful
          thisRef.setState({ ImageValidationPassed: true, ImageValidationFailed: false })
        }
        else {
          thisRef.setState({ ImageValidationPassed: false, ImageValidationFailed: true })
        }
      }
    };

    function cropPlusExport(img, id, cropWidth, cropHeight) {
      // create a temporary canvas sized to the cropped size
      var canvas1 = document.getElementById(id);
      var ctx1 = canvas1.getContext('2d');
      canvas1.width = cropWidth;
      canvas1.height = cropHeight;
      // use the extended from of drawImage to draw the
      // cropped area to the temp canvas
      ctx1.drawImage(img, 0, 0, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      // return the .toDataURL of the temp canvas
      return (canvas1.toDataURL());
    }
    reader.readAsDataURL(file);
  }


  render() {
    return (
      <div>
        <div className="common-padding font-bold">Please upload an image</div>
        <input className="common-padding" type="file" name="myImage" accept="image/*" onChange={this.handleChange} />
        {this.state.ImageValidationPassed &&
          <div>
            {this.state.selectedImage && <canvas className="common-padding" id="horizontal" src={this.state.selectedImage} />}

            {this.state.selectedImage && <canvas className="common-padding" id="vertical" src={this.state.selectedImage} />}

            {this.state.selectedImage && <canvas className="common-padding" id="horizontal-small" src={this.state.selectedImage} />}

            {this.state.selectedImage && <canvas className="common-padding" id="gallery" src={this.state.selectedImage} />}
          </div>
        }
        {this.state.ImageValidationFailed && <div className="error-class">Change the image dimensions to 1024*1024 dimension</div>}
      </div>
    );
  }
}
export default App;
