async function imageResizer(file, resizeValue) {
  var info = {
    realSize: (file.size / 1000).toFixed(2) + " KB",
    resizedSize: 0,
    realWidth: 0,
    realHeight: 0,
    resizedWidth: 0,
    resizedHeight: 0,
    resizedData: null,
  };

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve) => {
      img.onload = () => {
        info.realWidth = img.width;
        info.realHeight = img.height;
        info.resizedWidth = Math.round(info.realWidth * (1 - resizeValue)); //resizeValue is between 0-1
        info.resizedHeight = Math.round(info.realHeight * (1 - resizeValue));
        resolve();
      };
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = info.resizedWidth;
    canvas.height = info.resizedHeight;

    ctx.drawImage(img, 0, 0, info.resizedWidth, info.resizedHeight);

    const resizedDataURL = canvas.toDataURL(file.type);
    info.resizedSize = (resizedDataURL.length / 1000).toFixed(2) + " KB";
    info.resizedData = resizedDataURL;
    return info;

    /*
  
  reader.onload = async (event) => {
    const img = new Image();
    img.src = event.target.result;

    // in raw js, we have to use a promise to use await.
    await new Promise((resolve) => {
      img.onload = () => {
        info.realWidth = img.width;
        info.realHeight = img.height;
        info.resizedWidth = info.realWidth * (1 - resizeValue); //resizeValue is between 0-1
        info.resizedHeight = info.realHeight * (1 - resizeValue);
        resolve(info);
      };
    });

    //Creating offscreen (invisible) canvas for resizing image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = info.resizedWidth;
    canvas.height = info.resizedHeight;

    // 'file' provided as parameter is an object. We cannot draw it directly in to the canvas
    // To draw it, first create an image;
    ctx.drawImage(img, 0, 0, info.resizedWidth, info.resizedHeight);
    const resizedImageData = canvas.toDataURL(file.type);
    info.resizedSize = resizedImageData.length;
    info.resizedData = resizedImageData;
  }; //reader.onload
  reader.readAsDataURL(file);
  return info;

*/
  } catch (error) {
    console.error("Error in imageResizer:", error);
    throw error;
  }
}
export { imageResizer };
