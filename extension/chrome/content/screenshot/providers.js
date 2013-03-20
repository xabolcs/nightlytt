/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Providers = {
  _providers: [],
  _selected: null,
  
  addProvider: function(provider)
  {
    this._providers.push(provider);
    if (this._selected == null)
      this._selected = provider;
  },
  
  selectProvider: function(provider)
  {
    this._selected = provider;
  },
  
  getSelectedProvider: function()
  {
    return this._selected;
  },
  
  getProviders: function()
  {
    return this._providers;
  }
}

var ImageShack = {
  addFormFields: function(formdata)
  {
    formdata.addControl("uploadtype", "on");
    formdata.addControl("url", "paste image url here");
    formdata.addControl("MAX_FILE_SIZE", "3145728");
    formdata.addControl("refer", "");
    formdata.addControl("brand", "");
    formdata.addControl("optsize", "320x320");
  },
  
  getFileFormField: function()
  {
    return "fileupload";
  },
  
  getReferer: function()
  {
    return "http://www.imageshack.us/";
  },
  
  getSubmissionURL: function()
  {
    return "http://www.imageshack.us/";
  }
}

var AllYouCanUpload = {
  addFormFields: function(formdata)
  {
    formdata.addControl("images[0].submittedPhotoSize", "100%");
    formdata.addControl("imagesCount", "1");
  },
  
  getFileFormField: function()
  {
    return "images[0].fileName";
  },
  
  getReferer: function()
  {
    return "http://allyoucanupload.webshots.com/";
  },
  
  getSubmissionURL: function()
  {
    return "http://allyoucanupload.webshots.com/uploadcomplete";
  }
}

var GordonUploadScreenshot = {
  addFormFields: function(formdata)
  {
    formdata.addControl("apiKey", "31dc22b9221404130294843815");
  },
  
  getFileFormField: function()
  {
    return "userfile";
  },
  
  getReferer: function()
  {
    return "http://www.uploadscreenshot.com/api-documentation";
  },
  
  getSubmissionURL: function()
  {
    return "http://img1.uploadscreenshot.com/api-upload.php";
  }
}

var PostimageDotOrg = {
  addFormFields: function(formdata)
  {
    formdata.addControl("mode", "local");
    formdata.addControl("um", "image");
    formdata.addControl("mode", "local");
    formdata.addControl("forumurl", "http://postimage.org");
    //formdata.addControl("MAX_FILE_SIZE", 10*1024*1024);
    //formdata.addControl("hash", 671);
  },
  
  getFileFormField: function()
  {
    return "upload[]";
  },
  
  getReferer: function()
  {
    return "http://postimage.org";
  },
  
  getSubmissionURL: function()
  {
    return "http://postimage.org";
  }
}

Providers.addProvider(PostimageDotOrg);
Providers.addProvider(GordonUploadScreenshot);
//Providers.addProvider(ImageShack);
//Providers.addProvider(AllYouCanUpload);
