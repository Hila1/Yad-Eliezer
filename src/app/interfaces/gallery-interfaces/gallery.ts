// gallery configuration
export interface GALLERY_CONF {
    imageBorderRadius?: string; // css border radius of image (default 3px)
    imageOffset?: string; // add gap between image and it's container (default 20px)
    imagePointer? :boolean; // show a pointer on image, should be true when handling onImageClick event (default false)
    showDeleteControl?: boolean; // show image delete icon (default false)
    showCloseControl?: boolean; // show gallery close icon (default true)
    showExtUrlControl?: boolean; // show image external url icon (default true)
    showImageTitle?: boolean; // show image title text (default true)
    showThumbnails?: boolean; // show thumbnails (default true)
    closeOnEsc?: boolean; // close gallery on `Esc` button press (default true)
    reactToKeyboard?: boolean; // change image on keyboard arrow press (default true)
    reactToMouseWheel?: boolean; // change image on mouse wheel scroll (default true)
    reactToRightClick?: boolean; // disable right click on gallery (default false)
    thumbnailSize?: number; // thumbnail size (default 30)
    backdropColor?: string; // gallery backdrop (background) color (default rgba(13,13,14,0.85))
    inline?: boolean; // make gallery inline (default false)
    showArrows?: boolean; // show prev / next arrows (default true)
  }
   
  // gallery image
  export interface GALLERY_IMAGE {
    url: string; // url of the image
    thumbnailUrl?: string; // thumbnail url (recommended), if not present, gallery will use `url` property to get thumbnail image.
    altText?: string; // alt text for image
    title?: string; // title of the image
    extUrl?: string; // external url of image
    extUrlTarget?: string; // external url target e.g. '_blank', '_self' etc.
  }