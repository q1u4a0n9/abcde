document.addEventListener('DOMContentLoaded', () => {

    // === CÁC PHẦN TỬ GIAO DIỆN (DOM Elements) ===
    const planets = document.querySelectorAll('.planet');
    const infoBox = document.getElementById('info-box');
    const closeBtn = document.getElementById('close-btn');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const overlayScreen = document.getElementById('overlay-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const winMessage = document.getElementById('win-message');
    const introMessage = document.getElementById('intro-message');
    
    // === PHẦN TỬ ÂM THANH & NGƯỜI CHƠI ===
    const audio = document.getElementById('audio');
    const soundButton = document.getElementById('soundButton');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeSlider = document.getElementById('volume-slider');
    const playerNameInput = document.getElementById('player-name-input');
    const playerNameWinSpan = document.getElementById('player-name-win');
    
    // === PHẦN TỬ NÚT MỚI (NEW) ===
    const continueExploringBtn = document.getElementById('continue-exploring-btn');
    const travelToEarthBtn = document.getElementById('travel-to-earth-btn');

    // === BIẾN TRẠNG THÁI ===
    let selectedPlanet = null;
    const earthId = 'earth';
    let playerName = '';
    let lastVolume = 1;
    let earthFound = false; // <-- Cờ để đánh dấu đã tìm thấy Trái Đất

    const planetData = {
        mercury: { title: "Sao Thủy (Mercury)", description: "Hành tinh gần Mặt Trời nhất. Bề mặt đầy những hố va chạm." },
        venus: { title: "Sao Kim (Venus)", description: "Là hành tinh nóng nhất trong Hệ Mặt Trời do hiệu ứng nhà kính." },
        earth: { title: "Trái Đất (Earth)", description: "Chính nó! Ngôi nhà của chúng ta. Bạn đã tìm thấy nó rồi!" },
        moon: { title: "Mặt Trăng (Moon)", description: "Vệ tinh tự nhiên duy nhất của Trái Đất." },
        mars: { title: "Sao Hỏa (Mars)", description: "Hành tinh Đỏ, nổi tiếng với các cơn bão bụi và chỏm băng ở hai cực." },
        jupiter: { title: "Sao Mộc (Jupiter)", description: "Gã khổng lồ khí của Hệ Mặt Trời với Vết Đỏ Lớn nổi tiếng." },
        saturn: { title: "Sao Thổ (Saturn)", description: "Nổi tiếng với hệ thống vành đai ngoạn mục làm từ băng và đá." },
        uranus: { title: "Sao Thiên Vương (Uranus)", description: "Người khổng lồ băng giá này quay nghiêng gần 98 độ." },
        neptune: { title: "Sao Hải Vương (Neptune)", description: "Hành tinh xa nhất, một thế giới tối, lạnh và đầy gió." }
    };
    
    // === HÀM XỬ LÝ ÂM THANH (KHÔNG ĐỔI) ===
    function updateVolumeIcon(volume) {
        if (volume === 0 || audio.muted) volumeIcon.className = 'fas fa-volume-mute';
        else volumeIcon.className = 'fas fa-volume-up';
    }
    function handleVolumeChange(event) {
        const newVolume = parseFloat(event.target.value);
        audio.volume = newVolume;
        audio.muted = newVolume === 0;
        lastVolume = newVolume;
        updateVolumeIcon(newVolume);
    }
    function toggleMute() {
        if (audio.muted || audio.volume === 0) {
            audio.muted = false;
            audio.volume = lastVolume > 0 ? lastVolume : 0.5;
            volumeSlider.value = audio.volume;
        } else {
            lastVolume = audio.volume;
            audio.muted = true;
            volumeSlider.value = 0;
        }
        updateVolumeIcon(audio.volume);
    }

    // === LOGIC CHÍNH CỦA TRÒ CHƠI ===
    function startGame() {
        playerName = playerNameInput.value.trim() || 'Nhà du hành';
        audio.play().catch(error => console.warn("Autoplay bị chặn bởi trình duyệt:", error));
        overlayScreen.classList.remove('visible');
        planets.forEach(planet => planet.addEventListener('click', handlePlanetClick));
    }

    function handlePlanetClick(event) {
        event.stopPropagation();
        const clickedPlanet = event.currentTarget;
        const planetId = clickedPlanet.dataset.planetId;
        if (!planetId || clickedPlanet.classList.contains('discovered')) {
            // Nếu click lại Trái Đất khi đã tìm thấy, hiển thị lại màn hình win
            if (planetId === earthId && earthFound) {
                handleWin();
            }
            return;
        }
        clickedPlanet.classList.add('discovered');
        showInfo(planetId, clickedPlanet);
        if (planetId === earthId) {
            earthFound = true; // Đặt cờ là đã tìm thấy
            handleWin(); // Gọi hàm xử lý thắng cuộc
        }
    }

    function showInfo(planetId, planetElement) {
        if (selectedPlanet) selectedPlanet.classList.remove('highlight');
        const data = planetData[planetId];
        infoTitle.textContent = data.title;
        infoDescription.textContent = data.description;
        infoBox.classList.remove('hidden');
        planetElement.classList.add('highlight');
        selectedPlanet = planetElement;
    }

    function hideInfo() {
        if (infoBox.classList.contains('hidden')) return;
        infoBox.classList.add('hidden');
        if (selectedPlanet) {
            selectedPlanet.classList.remove('highlight');
            selectedPlanet = null;
        }
    }
    
    // === HÀM XỬ LÝ CHIẾN THẮNG (ĐÃ CẤU TRÚC LẠI HOÀN TOÀN) ===
    function handleWin() {
        // KHÔNG còn vô hiệu hóa các hành tinh khác nữa
        
        // Điền tên người chơi
        playerNameWinSpan.textContent = playerName;

        // Hiển thị ngay lập tức màn hình chiến thắng
        introMessage.classList.add('hidden');

        winMessage.classList.remove('hidden');
        overlayScreen.classList.add('visible');
    }   

    // === HÀM XỬ LÝ CHO CÁC NÚT MỚI ===
    function continueExploring() {
        // Đơn giản là ẩn màn hình overlay đi
        overlayScreen.classList.remove('visible');
    }

    function travelToEarth() {
        // Thực hiện việc chuyển trang
        winMessage.querySelector('p').textContent = 'Tuyệt vời! Đang chuyển bạn đến ngôi nhà mới...'; // Cập nhật text
        winMessage.querySelector('.win-buttons-container').style.display = 'none'; // Ẩn các nút đi
        
        setTimeout(() => {
            window.location.href = 'https://google.com'; // !!! THAY BẰNG LINK CỦA BẠN !!!
        }, 2000); // Chờ 2 giây rồi chuyển trang
    }

    // === GÁN SỰ KIỆN (EVENT LISTENERS) ===
    startGameBtn.addEventListener('click', startGame);
    closeBtn.addEventListener('click', hideInfo);
    document.body.addEventListener('click', hideInfo);
    infoBox.addEventListener('click', (event) => event.stopPropagation());
    
    soundButton.addEventListener('click', toggleMute); 
    volumeSlider.addEventListener('input', handleVolumeChange);
    
    // Gán sự kiện cho các nút mới
    continueExploringBtn.addEventListener('click', continueExploring);
    travelToEarthBtn.addEventListener('click', travelToEarth);
});