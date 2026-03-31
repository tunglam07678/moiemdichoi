function nextPage(pageId) {
    // Phát nhạc nền ở lần tương tác đầu tiên (khi bấm 'Bắt đầu nào')
    if (pageId === 'page2') {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Không thể phát nhạc:', e));
        }
    }

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Khôi phục nút No và Yes cho những trang có tính năng di chuyển nút No
    const pagesWithNoBtn = ['page2', 'page3'];

    pagesWithNoBtn.forEach(page => {
        const noBtnId = page === 'page2' ? 'btnNo2' : 'btnNo3';
        const yesBtnId = page === 'page2' ? 'btnYes2' : 'btnYes3';
        const containerId = page === 'page2' ? 'container2' : 'container3';

        const btnNo = document.getElementById(noBtnId);
        const btnYes = document.getElementById(yesBtnId);
        const container = document.getElementById(containerId);

        if (pageId === page) {
            btnNo.style.display = 'inline-block';
            if (btnNo.parentElement === document.body) {
                container.appendChild(btnNo);
            }
            btnNo.style.position = 'relative';
            btnNo.style.left = 'auto';
            btnNo.style.top = 'auto';
            btnNo.style.zIndex = '100';
            btnNo.dataset.moving = 'false';
            btnNo.style.transition = 'all 0.2s ease';

            btnYes.style.transform = 'scale(1)';
            btnYes.dataset.scale = '1';
        } else {
            if (btnNo) {
                btnNo.style.display = 'none';
            }
        }
    });

}

function moveButton(btnId) {
    const btnNo = document.getElementById(btnId);
    if (!btnNo || btnNo.style.display === 'none') return;

    const pageNum = btnId === 'btnNo2' ? '2' : '3';
    const btnYes = document.getElementById('btnYes' + pageNum);

    // Tăng kích thước nút Yes
    let currentScale = parseFloat(btnYes.dataset.scale || 1);
    currentScale += 0.3;
    btnYes.dataset.scale = currentScale;
    btnYes.style.transform = `scale(${currentScale})`;
    btnYes.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    if (btnNo.dataset.moving !== 'true') {
        const rect = btnNo.getBoundingClientRect();

        btnNo.style.transition = 'none';

        document.body.appendChild(btnNo);
        btnNo.style.position = 'fixed';
        btnNo.style.left = rect.left + 'px';
        btnNo.style.top = rect.top + 'px';
        btnNo.style.zIndex = '9999';
        btnNo.dataset.moving = 'true';

        void btnNo.offsetWidth;

        btnNo.style.transition = 'all 0.3s ease';
        setTimeout(() => moveButton(btnId), 10);
        return;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnWidth = btnNo.offsetWidth || 100;
    const btnHeight = btnNo.offsetHeight || 50;

    const safeLeft = 20;
    const safeRight = windowWidth - btnWidth - 20;
    const safeTop = 20;
    const safeBottom = windowHeight - btnHeight - 20;

    let newX, newY;
    let distanceToYes, distanceToCurrent;
    let attempts = 0;

    // Tọa độ trung tâm của nút Yes
    const yesRect = btnYes.getBoundingClientRect();
    const yesCenterX = yesRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top + yesRect.height / 2;

    // Tọa độ hiện tại của nút No
    const currRect = btnNo.getBoundingClientRect();
    const currCenterX = currRect.left + currRect.width / 2;
    const currCenterY = currRect.top + currRect.height / 2;

    do {
        newX = Math.random() * (safeRight - safeLeft) + safeLeft;
        newY = Math.random() * (safeBottom - safeTop) + safeTop;

        // Tọa độ trung tâm dự kiến của nút No
        const newCenterX = newX + btnWidth / 2;
        const newCenterY = newY + btnHeight / 2;

        // Khoảng cách từ vị trí mới tới nút Yes
        const dxYes = newCenterX - yesCenterX;
        const dyYes = newCenterY - yesCenterY;
        distanceToYes = Math.sqrt(dxYes * dxYes + dyYes * dyYes);

        // Khoảng cách từ vị trí mới tới vị trí hiện tại (để chép đi đủ xa)
        const dxCurr = newCenterX - currCenterX;
        const dyCurr = newCenterY - currCenterY;
        distanceToCurrent = Math.sqrt(dxCurr * dxCurr + dyCurr * dyCurr);

        attempts++;
        // Cần cách nút Yes ít nhất 150px (tránh nhảy kế bên Yes) và cách vị trí hiện tại ít nhất 100px (để tạo cảm giác di chuyển rõ rệt)
        // Nếu màn hình quá nhỏ (tìm quá 50 lần không ra), thì chấp nhận vị trí xa nhất có thể
    } while ((distanceToYes < 200 || distanceToCurrent < 100) && attempts < 50);

    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
}

// BƯỚC 1: Thay thế "CODE_CUA_BAN_O_DAY" bằng mã Form ID mà bạn tạo trên Formspree.io
// Ví dụ: const FORMSPREE_URL = "https://formspree.io/f/xdoqbqja";
const FORMSPREE_URL = "https://formspree.io/f/xvzwgqnk";

async function finish() {
    const flowerAnswer = document.getElementById('flowerInput').value;
    const questionAnswer = document.getElementById('questionInput').value;

    // Yêu cầu nhập ít nhất 1 trong 2 câu hoặc bắt buộc câu 2 tùy ý, ở đây mình cho gửi luôn nếu câu 2 trống nhưng câu 1 phải có
    if (flowerAnswer.trim() === '') {
        // Nếu lỡ người dùng chưa nhập hoa mà bấm qua, có thể back lại. 
        // Nhưng do giao diện chỉ đi tới nên ở bước này lấy câu hỏi cuối làm mốc
        console.log("Chưa nhập hoa");
    }

    // Đổi nút thành "Đang gửi..." để tránh bấm nhiều lần
    const btnSubmit = document.querySelector('#page5 button');
    const originalText = btnSubmit.innerText;
    btnSubmit.innerText = "Đang rinh câu trả lời về...";
    btnSubmit.disabled = true;

    try {
        if (FORMSPREE_URL.includes('CODE_CUA_BAN_O_DAY')) {
            console.log("Bạn chưa điền mã Formspree URL. Câu trả lời của ẻm là:", flowerAnswer, questionAnswer);
        } else {
            // Gửi dữ liệu qua Formspree để nhận ngay trên Email của bạn
            await fetch(FORMSPREE_URL, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "Loài hoa / màu hoa em ấy chọn": flowerAnswer || "Trống",
                    "Em ấy muốn làm gì tiếp theo/Có câu hỏi": questionAnswer || "Không có gì"
                })
            });
        }

        // Gửi xong thì chuyển sang trang 6 mừng rớt 
        nextPage('page6');
        startFallingText();

    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối hổng gửi được gòi! Nhắn tin trực tiếp lẹ đi nha 😢");
    } finally {
        btnSubmit.innerText = originalText;
        btnSubmit.disabled = false;
    }
}

// ----------------------------------------------------
// HIỆU ỨNG RƠI CHỮ CẢI TIẾN TRANG CUỐI CÙNG
// ----------------------------------------------------

const textArray = [
    "Em xinh nhất! 💕",
    "Em xinh số 1! 🌷",
    "Mãi lộng lẫy và kiêu sa ✨",
    "Luôn rạng rỡ và tươi cười nhé! 😊",
    "Vẻ đẹp mỹ miều không tì vết 💖",
    "Công chúa của anh 👑",
    "Thần thái đỉnh cao luôn đó 💐",
    "Duyên dáng và ngọt ngào 🥰",
    "Nàng thơ trong lòng anh 📖",
    "Vẻ đẹp thoát tục, lung linh 🌟",
    "Sắc sảo và đầy cuốn hút ⚡",
    "Mãi bên nhau em nhé! 🎉"
];

let lastXPos = -1;
let fallInterval;

function createFallingText() {
    const textContainer = document.createElement('div');
    textContainer.className = 'falling-text';
    textContainer.innerText = textArray[Math.floor(Math.random() * textArray.length)];

    let xPos;
    let attempts = 0;
    do {
        xPos = Math.random() * 83 + 2;
        attempts++;
    } while (Math.abs(xPos - lastXPos) < 15 && attempts < 10);
    lastXPos = xPos;

    // Gán vị trí bắt đầu vào biến CSS cho Transform Translate3d mượt mà
    textContainer.style.setProperty('--start-x', xPos + 'vw');

    const sizes = ['1.5rem', '1.8rem', '2rem', '2.5rem', '3rem', '3.5rem'];
    textContainer.style.fontSize = sizes[Math.floor(Math.random() * sizes.length)];

    const duration = Math.random() * 3.5 + 3.5;
    textContainer.style.animationDuration = duration + 's';

    const randomRotate = Math.floor(Math.random() * 50) - 25;
    textContainer.style.setProperty('--final-rotate', `${randomRotate}deg`);
    const randomTranslateX = Math.floor(Math.random() * 200) - 100;
    textContainer.style.setProperty('--final-translateX', `${randomTranslateX}px`);

    const colors = [
        '#ff4d6d', '#ff758f', '#c9184a', '#a53860', '#ffb3c1',
        '#ff0a54', '#e01e37', '#ff8fa3', '#ffc2d1', '#c1121f'
    ];
    const choosenColor = colors[Math.floor(Math.random() * colors.length)];
    textContainer.style.color = choosenColor;
    textContainer.style.textShadow = `0px 0px 8px ${choosenColor}, 0px 0px 15px rgba(255, 255, 255, 0.8)`;
    textContainer.style.filter = "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))";

    document.body.appendChild(textContainer);

    setTimeout(() => {
        textContainer.remove();
    }, duration * 1000);
}

function startFallingText() {
    fallInterval = setInterval(createFallingText, 350);
}
