// Blob image Animation

const blobImage = document.querySelector('.space-ship .image');

const animateBlob1 = () => {
    blobImage.style.borderRadius = "67% 33% 22% 78% / 66% 71% 29% 34%";
    

    setTimeout(animateBlob2, 3000);
}

const animateBlob2 = () => {
    blobImage.style.borderRadius = "30% 70% 70% 30% / 30% 30% 70% 70%";

    setTimeout(animateBlob1, 3000);
}

animateBlob1();