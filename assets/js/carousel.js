const config = {
    type: 'carousel',
    perView: 3,
    startAt: 0,
    autoplay: 4000,
    gap: 10
};

let glide = new Glide('.glide', config).mount();