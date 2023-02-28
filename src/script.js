const PLAYER_STORAGE_KEY = "F8";
const SONGS_REMOVE = "F8 SONGS REMOVE";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btnPlaying = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');
const removeSong = $('.song .option > i');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            "name": "Đế Vương",
            singer: "Đình Dũng",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1024/DeVuong-DinhDungACV-7121634.mp3?st=CX8cyLauI9Qlp9-Pp2APTg&e=1649040138&download=true",
            image: "https://avatar-nct.nixcdn.com/song/2021/11/29/a/9/5/0/1638180197658.jpg"
        },
        {
            "name": "Chạy Về Nơi Phía Anh",
            singer: " Khắc Việt",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1025/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3?st=hwfuMJ6YVnOquX2a8ALCzw&e=1649077359&download=true",
            image:
                "https://avatar-nct.nixcdn.com/song/2022/02/10/2/a/7/7/1644475457323.jpg"
        },
        {
            name: "Có Em Đây",
            singer: "Như Việt",
            path:
                "https://c1-ex-swe.nixcdn.com/NhacCuaTui1025/CoEmDay-NhuViet-7126614.mp3?st=a5yaCk1QZHuR1S0sWbAyxQ&e=1649066847",
            image: "https://avatar-nct.nixcdn.com/song/2022/01/12/f/c/b/f/1641968755745.jpg"
        },
        {
            name: "Hoa Tàn Tình Tan",
            singer: "Thanh Hưng",
            path: "https://aredir.nixcdn.com/NhacCuaTui1025/HoaTanTinhTan-GiangJolee-7126977.mp3?st=tpyzTQmhf2QwadIEoTBsZw&e=1649132268&download=true",
            image:
                "https://avatar-nct.nixcdn.com/song/2022/01/15/8/f/8/5/1642210210125.jpg"
        },
        {
            name: "Thuận Theo Ý Trời",
            singer: "Bùi Anh Tuấn",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui992/ThuanTheoYTroi-BuiAnhTuan-6150266.mp3?st=mrMrUWGBL5RGfWX7CA49YA&e=1648880930&download=true",
            image:
                "https://avatar-nct.nixcdn.com/song/2019/11/28/1/e/6/0/1574913186035.jpg"
        },
        {
            name: "Tìm Được Nhau Khó Thế Nào",
            singer: "Anh Tú",
            path:
                "https://c1-ex-swe.nixcdn.com/NhacCuaTui1025/TimDuocNhauKhoTheNaoOriginalMovieSoundtrackFromChiaKhoaTramTy-AnhTuTheVoice-7127088.mp3?st=iecNnFbMyYJ7PtG9uRpAWw&e=1648965315&download=true",
            image:
                "https://avatar-nct.nixcdn.com/song/2022/01/17/6/c/e/0/1642406689812.jpg"
        },
        {
            name: "Bảy Anh Em",
            singer: "Minh Huy,Pjnboys,Phức Hợp Hood",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1025/BayAnhEm-MinhHuyPjnboysPhucHopHood-7126898.mp3?st=UUKNQ7l4R_-53eautHUQuQ&e=1648878244&download=true",
            image:
                "https://avatar-nct.nixcdn.com/song/2022/01/14/1/c/7/f/1642142851414.jpg"
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `<div class="song ${ index === this.currentIndex ? 'active': '' }" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                            <i class="ti-download"></i></button>
                    </div>
                    </div>
                    `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Rotate cd
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: "rotate(360deg)"
            }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ khi scroll cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = (cdWidth - scrollTop) > 0 ? cdWidth - scrollTop : 0;
            cd.style.width = newWidth + 'px';
            cd.style.opacity = newWidth / cdWidth;
        };

        btnPlaying.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }


        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercentage;
            }
        }

        progress.onchange = function(e) {
            const seekTime = (e.target.value / 100) * audio.duration
            audio.currentTime = seekTime;
        }

        btnNext.onclick = function() {
            if (_this.isRandom) {
                _this.playrandomSong();
            } else {
                _this.next();
            }
            audio.play();
            _this.render();
            _this.scrollToViewSong();
        }

        btnPrev.onclick = function() {
            if (_this.isRandom) {
                _this.playrandomSong();
            } else {
                _this.previous();
            }
            audio.play();
        }

        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom);
        }

        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        }

        // Xu ly next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        }

        playlist.onclick = function(e) {
            const iconDownload = e.target.closest('.option');

            // Xử lý download nhạc
            if (iconDownload) {
                const songDownload = e.target.closest('.song:not(.active)');
                if (songDownload) {
                    _this.currentIndex = parseInt(songDownload.dataset.index);
                }
                let urlSong = _this.songs[_this.currentIndex].path;
                window.open(urlSong);
                return;

            }

            // Xử lý mở bài hát khi click trong playlist
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode) {
                // Xử lý event mở một bài nhạc khi click vào một bài nhạc
                _this.currentIndex = parseInt(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                audio.play();
            }
        }

    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        // this.songs = this.songs.filter(song => song.name !== this.config.songRemove[0].name);
        // console.log(this.songs);
    },
    loadSongsAfterRemoving: function() {
        for (let songRemove of this.songsRemove) {
            this.songs = this.songs.filter(song => song.name !== songRemove.name);
        }
    },
    next: function() {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    previous: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playrandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToViewSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 300)
    },
    start: function () {

        // Load config
        this.loadConfig();

        // Định nghĩa object currentSong dùng để load bài hát đang play
        this.defineProperties();

        // Render các bài hát
        this.render();

        // Load bài nhạc hiện tại
        this.loadCurrentSong();

        // Lắng nghe xử lý các sự kiện events (DOM events)
        this.handleEvents();

        // Load sự kiện Random & Repeat
        btnRandom.classList.toggle('active', this.config.isRandom);
        btnRepeat.classList.toggle('active', this.config.isRepeat);

    }
}
app.start();
