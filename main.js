const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_MUSIC = 'music_player';
const player = $('.player');
const playlists = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const cdWidth = cd.offsetWidth;
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_MUSIC)) || {},
    songs: [
        {
            name: "Ưng quá chừng",
            singer: "AMEE",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Gió",
            singer: "Jank",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "Là Anh",
            singer: "PhamLinh",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg",
        },
        {
            name: "Vũ Trụ Có Anh",
            singer: "Phương Mỹ Chi",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg",
        },
        {
            name: "Không thể say",
            singer: "HIEUTHUHAI",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg",
        },
        {
            name: "Về Với Em",
            singer: "Vo Ha Tram",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg",
        },
        {
            name: "Chờ Đợi Có Đáng Sợ",
            singer: "Andiez",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.jpg",
        },
        {
            name: "Em Hát Ai Nghe",
            singer: "Orange, Freak D",
            path: "./assets/music/song8.mp3",
            image: "./assets/img/song8.jpg",
        },
        {
            name: "Là Bạn Không Thể Yêu",
            singer: "Lou Hoàng",
            path: "./assets/music/song9.mp3",
            image: "./assets/img/song9.jpg",
        },
        {
            name: "Nàng Thơ",
            singer: "Hoàng Dũng",
            path: "./assets/music/song10.mp3",
            image: "./assets/img/song10.jpg",
        },
        {
            name: "Nếu Ngày Ấy",
            singer: "Khởi My, Vy Dương",
            path: "./assets/music/song11.mp3",
            image: "./assets/img/song11.jpg",
        },
        {
            name: "Tự Sự",
            singer: "Orange",
            path: "./assets/music/song12.mp3",
            image: "./assets/img/song12.jpg",
        },
    ],
    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_MUSIC, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map( (song,index) => {
            return `
                <div class="song ${index === app.currentIndex? 'active':''}" data-index = "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    
                    <div class="body"> 
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fa fa-ellipsis-h"></i>
                    </div>

                </div>
                `
        })
        playlists.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            },
        });
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        app.setConfig('currentIndex', this.currentIndex);


        // console.log(heading, cdThumb, audio);
    },
    handleEvents: function() {
        //Xử lý cd thumb
        const cdThumbAnimation = cdThumb.animate( [
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        }
        )

        cdThumbAnimation.pause();

        //Xử lý phóng to thu nhỏ playlists
        document.onscroll = function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth>0? newCdWidth + 'px':0 ;
        cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lý khi click play
        playBtn.onclick = function() {
            if (!app.isPlaying) {
                audio.play();
            } else {          
                audio.pause(); 
            }
        };

        // Khi song dc play
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimation.play();
        };

        // khi song on pause
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimation.pause();
        };

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
            progress.value = progressPercent;
        };

        //Xử lý khi tua time
        progress.onchange = function() {
            const seekTime = progress.value * audio.duration/100;
            audio.currentTime = seekTime;
        }
        //Xử lý khi next song
        nextBtn.onclick = function() {
            if( app.isRandom) {
                app.randomSong();
            } else{
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        // xử lý khi click prev song    
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //Bật tắt random bài hát
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            app.setConfig('isRandom', app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        }

        //bật tắt repeat button

        repeatBtn.onclick = function() {
            app.isRepeat =!app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        //Xử lý khi audio ended
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
            
        }

        //Lắng nghe hành vi click vào pkaylist
        playlists.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                
                //Xử lý vào song
                if(songNode) {
                    app.currentIndex = Number(songNode.getAttribute('data-index'));
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
            }
        }
        
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            const activeSong = $('.song.active');
            activeSong.scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            });
        })
        
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        if(this.config.currentIndex) {
            this.currentIndex = this.config.currentIndex;
        }
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) this.currentIndex = 0;
        app.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        app.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random()*this.songs.length);
        } while(newIndex == this.currentIndex);

        this.currentIndex = newIndex;

       
        app.loadCurrentSong();
    },

    start: function() {
        //Gán cấu hình
        this.loadConfig();

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe / xử lý các sự kiện DOM
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //render playlists
        this.render();

        //Hiển thị repeat và random đã lưu
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isRepeat);

    }
};

app.start();