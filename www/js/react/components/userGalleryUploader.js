import React from "react";
import DropzoneComponent from 'react-dropzone-component'
import request from 'superagent'
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css'
import update from 'react-addons-update';
var Config = require('Config');

export default class UserGalleryUploader extends React.Component{
  constructor(){
    super();

    this.state = {files:[]}
    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png' ],
      showFiletypeIcon: true,
      postUrl: Config.s3_address
    };


    this.dropzoneobj = null;


  }

  componentWillMount()
  {

    var _root = this;

    this.djsConfig =
    {
                dictDefaultMessage: "Drag & drop your images here or click anyhere in this box to select a file.",
                autoProcessQueue: true,
                addRemoveLinks: true,
                acceptedFiles: "image/jpeg,image/png",
                maxFiles: this.props['maxFiles'],
                uploadMultiple :false,
                parallelUploads:3,
                maxFilesize: 6, // in mb
                sending: function(file, xhr, formData){
                  $.each(file.postData, function(k, v){
                      formData.append(k, v);
                  });
                  formData = file.postData;
                },
                accept: function(file, done)
                {
                   file.postData = [];
                   var object = { objectName : file.name, contentType : file.type, folderName: _root.props['folderName'] };
                   request
                  .get(Config.restRoot + "/info/s3sign")
                  .query(object)
                  .set({'Accept': 'application/json'})
                  .retry(5)
                  .end( function(error, res) {
                      if(error){ return;}
                      if(res.statusCode !== 200) return alert('ByMeal backend error')
                      else
                      {
                        const response = JSON.parse(res.text);
                        file.s3url = _root.componentConfig.postUrl + response['fields']['key'];
                        file.postData = response['fields'];
                        done();
                      }
                  });
                }
    }


    this.eventHandlers = {   error: this.handleError,
                             success: this.handleUploadSuccess.bind(this),
                             removedfile: this.handleRemove.bind(this),
                             init: function (dropzone) {
                                _root.dropzoneobj = dropzone;
                              }
                          };



  }

  handleError(file, error)
  {
    alert(error)
  }

  handleUploadSuccess(file)
  {
    this.state.files.push(file)
    this.props.onChange(this.state.files.map(function(a) {return a.s3url;}));
  }

  handleRemove(file)
  {
    var array = this.state.files;
    var index = array.indexOf(file);
    this.setState({
      files:  update(this.state.files, {$splice: [[index, 1]]})
    })
    this.props.onChange(this.state.files.map(function(a) {return a.s3url;}));
  }

  render(){
    return(
      <div>
        <DropzoneComponent
        config={this.componentConfig}
        djsConfig={this.djsConfig}
        eventHandlers={this.eventHandlers}
        />

        </div>
    );
   }

}

UserGalleryUploader.defaultProps = {
    maxFiles: 6,
    style: {}
}

UserGalleryUploader.propTypes = {
   folderName : React.PropTypes.string.isRequired,
}
