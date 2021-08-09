let vm = new Vue({
    el: "#app",
    data: ()=> {
        return {
            size: '4',
            width_field: '500',
            nums: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0],
            data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0],
            matrix: [],
            render: true,
            fin: false,
            timeout: 2000,
            moves: 0,
        }
    },
    created() {
        this.matrix_start();
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
        matrix_start() {
            this.matrix = [];
            for (let i = 0; i < this.size; i++) {
                this.matrix.push([]);
            }
            for (let i = 0; i < this.nums.length; i++) {
                this.matrix[Math.floor(i / this.size)].push(this.nums[i]);
            }
        },
        data_start() {
            // let's make responsive start
            let width = document.documentElement.clientWidth;
            let height = document.documentElement.clientHeight;
            if (width < height) {
                if (width < 600) {
                    this.width_field = Math.floor(width * 0.8 / this.size) * this.size;
                }
            } else {
                if (height < 600) {
                    this.width_field = Math.floor(height * 0.8 / this.size) * this.size;
                }
            }
        },
        resize() {
            // responsive resize
            let width = document.documentElement.clientWidth;
            let height = document.documentElement.clientHeight;
            if (width < height) {
                if (width < 600) {
                    this.width_field = Math.floor(width * 0.8 / this.size) * this.size;
                }
            } else {
                if (height < 600) {
                    this.width_field = Math.floor(height * 0.8 / this.size) * this.size;
                }
            }
            this.renew_data();
        },
        rerender() {
            // render DOM to remove previous 'top' & 'left' values from tiles
            this.render = false;
            this.$nextTick(()=> {
                this.render = true;
            });
        },
        shuffle() {
            /*  random shuffle - First method
            let numbers = [...this.nums];
            let first, second, temporary;
            for (let i = 0; i < this.size ** 2; i++) {
                first = Math.floor(Math.random() * (this.size ** 2));
                second = Math.floor(Math.random() * (this.size ** 2));
                temporary = numbers[first];
                numbers[first] = numbers[second];
                numbers[second] = temporary;
            }
            this.data = numbers;

            this.matrix = [];
            for (let i = 0; i < this.size; i++) {
                this.matrix.push([]);
            }
            for (let i = 0; i < this.data.length; i++) {
                this.matrix[Math.floor(i / this.size)].push(this.data[i]);
            }
            */
            this.matrix_start();
            this.mess();
            this.renew_data();
            this.moves = 0;
        },
        mess() {
            for (let i = 0; i < 500; i++) {
                let x, y;
                let dx, dy;
                outer:
                for (y = 0; y < this.size; y++) {
                    for (x = 0; x < this.size; x++) {
                        if (this.matrix[y][x] == 0) {
                            break outer;
                        }
                    }
                }
                
                let xy = Math.round(Math.random());
                if (xy === 0) {
                    let xr = Math.round(Math.random());
                    if (x === 0) {
                        dx = x + 1;
                    } else if ( x === 3) {
                        dx = x - 1;
                    } else {
                        xr === 0 ? dx = x - 1 : dx = x + 1;
                    }
                    dy = y;
                } else {
                    let yr = Math.round(Math.random());
                    if (y === 0) {
                        dy = y + 1;
                    } else if ( y === 3) {
                        dy = y - 1;
                    } else {
                        yr === 0 ? dy = y - 1 : dy = y + 1;
                    }
                    dx = x;
                }
                this.matrix[y].splice(x, 1, this.matrix[dy][dx]);
                this.matrix[dy].splice(dx, 1, 0);
            }            
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
            for (y = 0; y < this.size; y++) {
                for (x = 0; x < this.size; x++) {
                    if (this.matrix[x][y] == value) {
                        break outer;
                    }
                }
            }
            this.moveTile(tile, x, y);            
        },
        moveTile(tile, row, col) {
            let dx = 0;
            let dy = 0;
            if (col > 0 && this.matrix[row][col - 1] == 0) {
                dx = -1;
            } else if (col < (this.size - 1) && this.matrix[row][col + 1] == 0) {
                dx = 1;
            } else if (row > 0 && this.matrix[row - 1][col] == 0) {
                dy = -1;
            } else if (row < (this.size - 1) && this.matrix[row + 1][col] == 0) {
                dy = 1;
            } else {
                return;
            }

            let this_tile = this.matrix[row][col];
            
            this.matrix[row + dy].splice(col + dx, 1, this_tile);
            this.matrix[row].splice(col, 1, 0);
            
            tile.style.left = parseInt(tile.style.left) + this.width_tile * dx + 'px';
            tile.style.top = parseInt(tile.style.top) + this.width_tile * dy + 'px';
            
            this.move_sound();
            this.moves++;
            // Check if the game is over
            if (JSON.stringify([].concat(...this.matrix)) === JSON.stringify(this.nums)) {
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
        renew_data() {
            this.data = this.matrix.flat();
            this.rerender();
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
                this.$refs.play.style.transform = 'rotateY(0)';
            } else {
                audio.pause();
                this.$refs.play.style.transform = 'rotateY(180deg)';
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
                height: this.width_tile + 'px',
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
                padding: '0.8rem',
                margin: '0 1rem'
            }
        },
        feature() {
            return {
                width: this.width_tile / 2 + 'px',
                height: this.width_tile / 2 + 'px',
                "line-height": this.width_tile / 2 + 'px',
                "font-size": this.width_tile / 4.5 + 'px',
            }
        }
    }
})


