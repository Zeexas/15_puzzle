let vm = new Vue({
    el: "#app",
    data: ()=> {
        return {
            size: '4',
            width_field: '500',
            nums: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0],
            shuffledNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0],
            data: [],
            render: true,
            fin: false,
            timeout: 2000,
            moves: 0,
        }
    },
    created() {
        window.addEventListener('resize', this.resize);
        this.resize();
    },

    mounted() {
        this.data_start();
    },

    destroyed() {
        window.removeEventListener('resize', this.resize);
    },

    methods: {
        data_start() {
            this.data = [];
            for (let i = 0; i < this.size; i++) {
                this.data.push([]);
            }
            for (let i = 0; i < this.shuffledNumbers.length; i++) {
                this.data[Math.floor(i / this.size)].push(this.shuffledNumbers[i]);
            }
            // let's make responsive when start
            let screenWidth = document.documentElement.clientWidth;
            let screenHeight = document.documentElement.clientHeight;
            if (this.screenWidth < this.screenHeight) {
                if (this.screenWidth < 600) {
                    this.width_field = screenWidth * 0.8;
                }
            } else {
                if (this.screenHeight < 600) {
                    this.width_field = screenHeight * 0.8;
                }
            }
        },
        resize() {
            // responsive resize
            let width = document.documentElement.clientWidth;
            let height = document.documentElement.clientHeight;
            if (width < height) {
                if (width < 600) {
                    this.width_field = width * 0.8;
                }
            } else {
                if (height < 600) {
                    this.width_field = height * 0.8;
                }
            }
        },
        rerender() {
            // render DOM to remove previous 'top' & 'left' values from tiles
            this.render = false;
            this.$nextTick(()=> {
                this.render = true;
            });
        },
        shuffle() {
            let numbers = [...this.nums];
            let first, second, temporary;
            for (let i = 0; i < this.size ** 2; i++) {
                first = Math.floor(Math.random() * (this.size ** 2));
                second = Math.floor(Math.random() * (this.size ** 2));
                temporary = numbers[first];
                numbers[first] = numbers[second];
                numbers[second] = temporary;
            }
            
            this.shuffledNumbers = numbers;

            this.data = [];
            for (let i = 0; i < this.size; i++) {
                this.data.push([]);
            }
            for (let i = 0; i < this.shuffledNumbers.length; i++) {
                this.data[Math.floor(i / this.size)].push(this.shuffledNumbers[i]);
            }
            this.rerender();
            this.moves = 0;
        },
        
        position_tile(tile, row, col) {
            let x = row * this.width_tile;
            let y = col * this.width_tile;
            tile.style.top = x + 'px';
            tile.style.left = y + 'px';
        },
        tileClicked(e) {
            let tile = e.target;
            let value = parseInt(tile.innerHTML);
            let x, y;
            outer:
            for (x = 0; x < this.size; x++) {
                for (y = 0; y < this.size; y++) {
                    if (this.data[x][y] == value) {
                        break outer;
                    }
                }
            }
            this.moveTile(tile, x, y);            
        },
        moveTile(tile, row, col) {
            let dx = 0;
            let dy = 0;
            if (col > 0 && this.data[row][col - 1] == 0) {
                dy = -1;
            } else if (col < (this.size - 1) && this.data[row][col + 1] == 0) {
                dy = 1;
            } else if (row > 0 && this.data[row - 1][col] == 0) {
                dx = -1;
            } else if (row < (this.size - 1) && this.data[row + 1][col] == 0) {
                dx = 1;
            } else {
                return;
            }

            let this_tile = this.data[row][col];
            
            this.data[row + dx].splice(col + dy, 1, this_tile);
            this.data[row].splice(col, 1, 0);
            
            tile.style.left = parseInt(tile.style.left) + this.width_tile * dy + 'px';
            tile.style.top = parseInt(tile.style.top) + this.width_tile * dx + 'px';

            this.move_sound();
            this.moves++;

            if (JSON.stringify([].concat(...this.data)) === JSON.stringify(this.nums)) {
                this.applause();
                this.fin = true;
                setTimeout(() => {
                    this.fin = false;
                }, this.timeout);

                this.$refs.shuffle.disabled = true;
                setTimeout(() => {
                    this.$refs.shuffle.disabled = false;
                }, this.timeout);
            }
        },
        move_sound() {
            let sound = this.$refs.move_sound;
            sound.volume = 0.2;
            sound.play();
        },
        play() {
            let audio = this.$refs.music;
            if (audio.paused) {
                audio.volume = 0.2;
                audio.play();
            } else {
                audio.pause();
            }
        },
        applause() {
            let claps = this.$refs.applause;
            claps.volume = 0.5;
            claps.play();
        }
    },
    computed: {
        width_tile() {
            return this.width_field / this.size;
        },
        draw_field() {
            return {
                width: this.width_field + 'px',
                height: this.width_field + 'px',
            }
        },
        draw_tiles() {
            return {
                width: this.width_tile + 'px',
                height: this.widthCongratulatioins_tile + 'px',
                "font-size": Math.floor(this.width_tile * 2 / 3) + 'px',
                "line-height": Math.floor(this.width_tile) + 'px',
            }
        },
        gross_field() {
            return {
                "line-height": this.width_field + 'px',
                "font-size": this.width_field * 0.15 + 'px',
            }
        },
        shuffle_button() {
            return {
                "font-size": Math.floor(this.width_tile / 3) + 'px',
                width: this.width_field / 2 + 'px',
                padding: '0.8rem 3rem',
                margin: '0 1rem'
            }
        },
        feature() {
            return {
                width: this.width_tile / 2 + 'px',
                height: this.width_tile / 2 + 'px',
                "line-height": this.width_tile / 2 + 'px',
                "font-size": this.width_tile / 4 + 'px',
            }
        }
    }
})


