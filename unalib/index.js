const unalib = {
  is_valid_phone: function (phone) {
    var isValid = false;
    var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;

    try {
      isValid = re.test(phone);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  is_valid_image: function (image) {
    var isValid = false;
    var re = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

    try {
      isValid = re.test(image);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  is_valid_video: function (video) {
    var isValid = false;
    var re = /\.(mp4|webm|ogg)$/i;

    try {
      isValid = re.test(video);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  validateMessage: function (msg) {
    var obj = JSON.parse(msg);

    if (this.is_youtube_url(obj.mensaje)) {
      console.log("Es un video de YouTube!");
      var videoId = this.extract_youtube_id(obj.mensaje);
      obj.mensaje = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
                      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen></iframe>`;
    } else if (this.is_valid_phone(obj.mensaje)) {
      console.log("Es un teléfono!");
      obj.mensaje = `<a href="tel:${obj.mensaje}" style="text-decoration: none; color: blue;">
                       <i class="fa fa-phone"></i> ${obj.mensaje}
                     </a>`;
    } else if (this.is_valid_image(obj.mensaje)) {
      console.log("Es una imagen!");
      obj.mensaje = `<img src="${obj.mensaje}" alt="Imagen" style="max-width: 300px; border-radius: 10px;">`;
    } else if (this.is_valid_video(obj.mensaje)) {
      console.log("Es un video!");
      obj.mensaje = `<video controls style="max-width: 400px; border-radius: 10px;">
                       <source src="${obj.mensaje}" type="video/mp4">
                       Tu navegador no soporta la etiqueta de video.
                     </video>`;
    } else {
      console.log("Es un texto!");
    }

    return JSON.stringify(obj);
  },

  getEmbeddedCode: function (msg) {
    var re = /<iframe.*?src="([^"]*)".*?<\/iframe>/g;
    var match = re.exec(msg);
    
    if (match && match[0]) {
      return match[0];
    } else {
      return null;
    }
  },

  is_youtube_url: function (url) {
    var youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  },

  extract_youtube_id: function (url) {
    var youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    var match = youtubeRegex.exec(url);
    return match ? match[1] : null;
  }
};

// Exportamos el objeto unalib como default
export default unalib;
