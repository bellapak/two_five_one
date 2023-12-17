let images = [];
let selectedImage = null;
let offsetX, offsetY;
let sounds = [];
let spacebarSounds = [];
let currentSoundIndex = 0;
let spacebarSoundIndex = 0;
let playbackRate = 1.0;
let isDragging = false;
let spacebarSound;
let spacebarCount = 0;


function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    for (let i = 0; i < 10; i++) {
        let sound = loadSound(`sound2/spacebar${i + 1}.mp3`);
        spacebarSounds.push(sound);
    }

    for (let i = 0; i < 36; i++) {
        let sound = loadSound(`sound/sound${i + 1}.mp3`);
        sounds.push(sound);
    }
    arrangeImages();
    spacebarSound = spacebarSounds[0]; // 첫 번째 루프 음악 설정
    spacebarSound.loop();
}

function mouseDragged() {
    if (selectedImage) {
        selectedImage.position(mouseX + offsetX, mouseY + offsetY);
    }
    isDragging = true;
}

// 마우스 드래그가 끝났을 때 이벤트를 처리하는 함수
function mouseReleased() {
    isDragging = false;
}

function arrangeImages() {
    for (let i = 0; i < 36; i++) {
        let size = 200;
        let blendMode = MULTIPLY;
        let img = createImg(`img/Asset ${i + 1}@4x.png`).size(size, size);
        let x = (width - size * 6) / 2 + (i % 6) * size;
        let y = (height - size * 6) / 2 + Math.floor(i / 6) * size;
        img.position(x, y);
        images.push({ img, size, blendMode, sound: sounds[i] });
        img.mousePressed(imageClicked.bind(null, i));
    }
}

function imageClicked(index) {
    // 선택된 이미지의 음악을 재생
    let { sound } = images[index];
    
    if (sound.isPlaying()) {
        // 이미 재생 중인 경우, 다시 재생
        sound.play();
    } else {
        // 멈춤 상태인 경우, 재생
        sound.play();
    }
}
function mousePressed() {
    for (let i = 0; i < images.length; i++) {
        let img = images[i].img;
        let imgX = img.position().x;
        let imgY = img.position().y;
        if (
            mouseX > imgX &&
            mouseX < imgX + images[i].size &&
            mouseY > imgY &&
            mouseY < imgY + images[i].size
        ) {
            let r = random(255);
            let g = random(100, 255);
            let b = random(150, 255);
            img.style("filter", `brightness(150%) hue-rotate(${b}deg) saturate(${r}%) contrast(${g}%)`);
            selectedImage = img;
            offsetX = imgX - mouseX;
            offsetY = imgY - mouseY;
        }
    }
}


function rearrangeImages() {
    shuffle(images, true);

    // 유지하려는 그리드 크기
    let gridRows = 6;
    let gridCols = 6;

    let size = 200;
    for (let i = 0; i < images.length; i++) {
        let img = images[i].img;
        let x = (width - size * gridCols) / 2 + (i % gridCols) * size;
        let y = (height - size * gridRows) / 2 + Math.floor(i / gridCols) * size;
        img.position(x, y);
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (windowWidth < windowHeight) {
        arrangeImages(7, 7);
    } else {
        arrangeImages(7, 9); // 변경된 부분: 전체 화면일 때 7x9 그리드로 배치
    }
}



function keyPressed() {
    if (key === '1') {
        playbackRate = 0.5;
        updatePlaybackRate();
    } else if (key === '2') {
        playbackRate = 1.0;
        updatePlaybackRate();
    } else if (key === '5') {
        playbackRate = 2.0;
        updatePlaybackRate();
    }

    if (key === ' ') {
        // 스페이스바를 눌렀을 때
        if (spacebarCount < 1) {
            rearrangeImages();
            spacebarCount++;
        }
        rearrangeImages();
        resetImageColors();
        spacebarSound.stop();
        spacebarSoundIndex = (spacebarSoundIndex + 1) % spacebarSounds.length;
        spacebarSound = spacebarSounds[spacebarSoundIndex];
        spacebarSound.loop();
    }
}

function resetImageColors() {
    for (let i = 0; i < images.length; i++) {
        let img = images[i].img;
        img.style("filter", `brightness(100%) hue-rotate(0deg) saturate(100%) contrast(100%)`);
    }
}

// function resetImageColors() {
//     for (let i = 0; i < images.length; i++) {
//         let img = images[i].img;
//         img.style("filter", `brightness(100%) hue-rotate(0deg) saturate(100%) contrast(100%)`);
//     }
// }

function updatePlaybackRate() {
    sounds[currentSoundIndex].rate(playbackRate);
}

function drawImages() {
    for (let i = 0; i < images.length; i++) {
        let { img, size, blendMode } = images[i];
        push();
        blendMode(blendMode);
        img.size(size, size);
        pop();
    }
}

function draw() {
    background(0);
    drawImages();

    
}
