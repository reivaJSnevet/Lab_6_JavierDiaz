import unalib from '../unalib/index.js';
import assert from 'assert';

// Pruebas de la biblioteca `unalib`
describe('unalib', function() {

  // Prueba de la función `is_valid_phone`
  describe('función is_valid_phone', function() {
    it('debería devolver true para un número de teléfono válido 8297-8547', function() {
      assert.equal(unalib.is_valid_phone('8297-8547'), true);
    });

    it('debería devolver false para un número de teléfono inválido ABC-1234', function() {
      assert.equal(unalib.is_valid_phone('ABC-1234'), false);
    });

    it('debería devolver true para un número de teléfono con código de país +1 (829) 785-8547', function() {
      assert.equal(unalib.is_valid_phone('+1 (829) 785-8547'), true);
    });

    it('debería devolver false para una cadena vacía', function() {
      assert.equal(unalib.is_valid_phone(''), false);
    });
  });

  // Prueba de la función `is_valid_image`
  describe('función is_valid_image', function() {
    it('debería devolver true para un archivo con extensión .jpg', function() {
      assert.equal(unalib.is_valid_image('imagen.jpg'), true);
    });

    it('debería devolver true para un archivo con extensión .png', function() {
      assert.equal(unalib.is_valid_image('imagen.png'), true);
    });

    it('debería devolver false para un archivo con extensión .txt', function() {
      assert.equal(unalib.is_valid_image('documento.txt'), false);
    });

    it('debería devolver false para una cadena vacía', function() {
      assert.equal(unalib.is_valid_image(''), false);
    });
  });

  // Prueba de la función `is_valid_video`
  describe('función is_valid_video', function() {
    it('debería devolver true para un archivo con extensión .mp4', function() {
      assert.equal(unalib.is_valid_video('video.mp4'), true);
    });

    it('debería devolver true para un archivo con extensión .webm', function() {
      assert.equal(unalib.is_valid_video('video.webm'), true);
    });

    it('debería devolver false para un archivo con extensión .mp3', function() {
      assert.equal(unalib.is_valid_video('audio.mp3'), false);
    });

    it('debería devolver false para una cadena vacía', function() {
      assert.equal(unalib.is_valid_video(''), false);
    });
  });

  // Prueba de la función `validateMessage`
  describe('función validateMessage', function() {
    it('debería identificar un número de teléfono en el mensaje', function() {
      var mensaje = JSON.stringify({ nombre: "Usuario", mensaje: "8297-8547", color: "#FFFFFF" });
      var resultado = unalib.validateMessage(mensaje);
      assert.ok(resultado.includes('<a href="tel:'));
    });

    it('debería identificar una imagen en el mensaje', function() {
      var mensaje = JSON.stringify({ nombre: "Usuario", mensaje: "imagen.jpg", color: "#FFFFFF" });
      var resultado = unalib.validateMessage(mensaje);
      assert.ok(resultado.includes('<img src="imagen.jpg"'));
    });

    it('debería identificar un video en el mensaje', function() {
      var mensaje = JSON.stringify({ nombre: "Usuario", mensaje: "video.mp4", color: "#FFFFFF" });
      var resultado = unalib.validateMessage(mensaje);
      assert.ok(resultado.includes('<video controls'));
    });

    it('debería identificar un video de YouTube en el mensaje', function() {
      var mensaje = JSON.stringify({ nombre: "Usuario", mensaje: "https://youtu.be/dQw4w9WgXcQ", color: "#FFFFFF" });
      var resultado = unalib.validateMessage(mensaje);
      assert.ok(resultado.includes('<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ"'));
    });

    it('debería identificar un mensaje de texto regular', function() {
      var mensaje = JSON.stringify({ nombre: "Usuario", mensaje: "Hola, ¿cómo estás?", color: "#FFFFFF" });
      var resultado = unalib.validateMessage(mensaje);
      assert.ok(resultado.includes("Hola, ¿cómo estás?"));
    });
  });

  // Prueba de la función `getEmbeddedCode`
  describe('función getEmbeddedCode', function() {
    it('debería devolver el iframe completo si está presente en el mensaje', function() {
      var iframe = '<iframe src="https://example.com"></iframe>';
      var resultado = unalib.getEmbeddedCode(iframe);
      assert.equal(resultado, iframe);
    });

    it('debería devolver null si no hay iframe en el mensaje', function() {
      var mensaje = 'Este mensaje no tiene iframe.';
      var resultado = unalib.getEmbeddedCode(mensaje);
      assert.equal(resultado, null);
    });
  });

});
