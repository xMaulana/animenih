const axios = require("axios")
const jsdom = require("jsdom")
const {JSDOM} = jsdom

const virtualConsole = new jsdom.VirtualConsole()
// virtualConsole.on("error", () =>{
//     "moduleNameMapper": {
//         "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
//         "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
//       }
// })

const user_agent = [
    'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
]
const website = "https://otakudesu.bid"

const getData = async (link)=>{
    const data = await axios.get(link, {
        headers: {
            "User-Agent": user_agent[Math.floor(Math.random()%user_agent.length)],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
        }
    });
    return new JSDOM(data.data, {virtualConsole}).window.document;
};

module.exports ={
    getData,
    getHome: () => new Promise( async (resolve, reject) =>{
        try{
            const has = await getData(website);
            let anim = {
                onGoing: [],
                selesai: []
            }

            let animdat = has.querySelector("div.venutama div.rseries div.rapi div.venz");
            animdat.querySelector("ul").querySelectorAll("li").forEach(res =>{
                const hasil = {
                    judul: res.querySelector("div.thumb div.thumbz h2").textContent,
                    episode : res.querySelector("div.epz").textContent.slice(1),
                    gambar : res.querySelector("div.thumb img").getAttribute("src"),
                    href : res.querySelector("div.thumb a").getAttribute("href").replace("https://otakudesu.bid/anime/", "")
                }
                anim.onGoing.push(hasil)
            })

            animdat = has.querySelector("div.venutama div.rseries div.rseries div.rapi div.venz");
            animdat.querySelector("ul").querySelectorAll("li").forEach(res =>{
                const hasil ={
                    judul: res.querySelector("div.thumb div.thumbz h2").textContent,
                    episode : res.querySelector("div.epz").textContent,
                    gambar : res.querySelector("div.thumb img").getAttribute("src"),
                    href : res.querySelector("div.thumb a").getAttribute("href").replace("https://otakudesu.bid/anime/","")
                }
                anim.selesai.push(hasil)
            })
            resolve({status: true, data: anim})
        } catch(err){
            reject({status: false, error: err.msg})
        }
    }),

    getAnime: (nama) => new Promise(async (resolve, reject) =>{
        try{
            const has = await getData(`${website}/anime/${nama}`)
            let ven = has.querySelector("div#venkonten")
            let hasil = {
                gambar: ven.querySelector("div.venser div.fotoanime img").getAttribute("src"),
                info: Array.from(ven.querySelector("div.fotoanime div.infozin div.infozingle")
                    .querySelectorAll("p"))
                    .map(res => {
                        return res.querySelector("span").innerHTML.replace(/<(?!b\b|\/b\b)[^>]*>/g, '');
                    }),
                link: Array.from(Array.from(ven.querySelectorAll("div.venser div.episodelist"))
                    .filter(div => div.querySelector("ul > li")))
                    .map(res =>{
                        return {
                            judul: res.querySelector("span.monktit").textContent,
                            link: Array.from(res.querySelectorAll("ul > li"))
                            .map(res =>{
                                return {
                                    judul: res.querySelector("span a").textContent,
                                    href: res.querySelector("span a").getAttribute("href").replace("https://otakudesu.bid/", ""),
                                    tanggal: res.querySelector("span.zeebr").textContent
                                    }
                                })
                        }
                    }),
                rekomendasi: Array.from(ven.querySelector("div.isi-recommend-anime-series")
                            .querySelectorAll("div.isi-konten"))
                            .map(res =>{
                                return {
                                    gambar: res.querySelector("div.isi-anime a img").getAttribute("src"),
                                    link: res.querySelector("div.isi-anime a").getAttribute("href").replace("https://otakudesu.bid/anime/", ""),
                                    judul: res.querySelector("div.isi-anime span a").textContent
                                }
                            })
            }
            resolve({status: true, data: hasil})
        } catch(err){
            reject({status: false, error: err.message})
        }
    }),

    getEpisode: (link) => new Promise(async (resolve,reject) =>{
        try{
            const has = await getData(`${website}/episode/${link}`)
            let vid = has.querySelector("div#venkonten div.venser")
            
            let data = {
                judul: vid.querySelector("h1.posttl").textContent,
                video: has.querySelector("div#pembed div.responsive-embed-stream iframe").getAttribute("src"),
                link: Array.from(vid.querySelector("div.download").querySelectorAll("ul")).map(res =>{
                    return Array.from(res.querySelectorAll("li")).map(nih =>{
                        return {
                            kualitas: nih.querySelector("strong").textContent,
                            link: Array.from(nih.querySelectorAll("a"))
                            .map(dis =>{
                                return {
                                    via: dis.textContent,
                                    link: dis.getAttribute("href")
                                }
                            }),
                            size: nih.querySelector("i").textContent
                        }
                    })
                })
            }
            resolve({status: true, data})
        }catch(err){
            reject({status: false, error: err.message})
        }
    }),

    getBatch: (link) => new Promise(async (resolve,reject) =>{
        try{
            const has = await getData(`${website}/batch/${link}`)
            let vid = has.querySelector("div#venkonten > div.venser")
            
            let data = {
                judul: vid.querySelector("div.jdlrx > h1").textContent,
                img: vid.querySelector("div.animeinfo > div.kanan > div.imganime > div.separator > img").getAttribute("src"),
                link: Array.from(vid.querySelector("div.download2 div.batchlink").querySelectorAll("ul")).map(res =>{
                    return Array.from(res.querySelectorAll("li")).map(nih =>{
                        return {
                            kualitas: nih.querySelector("strong").textContent,
                            link: Array.from(nih.querySelectorAll("a"))
                            .map(dis =>{
                                return {
                                    via: dis.textContent,
                                    link: dis.getAttribute("href")
                                }
                            }),
                            size: nih.querySelector("i").textContent
                        }
                    })
                })
            }
            resolve({status: true, data})
        }catch(err){
            reject({status: false, error: err.message})
        }
    }),

    getLengkap: (judul) => new Promise(async (resolve,reject) =>{
        try{
            const has = await getData(`${website}/lengkap/${judul}`)
            const vid = has.querySelector("div#venkonten > div.vezone")
            let data = {
                judul: vid.querySelector("div.jdlrx > h1").textContent,
                img: has.querySelector("div.animeinfo > div.kanan > div.imganime > div.separator > img").getAttribute("src"),
                link: Array.from(has.querySelectorAll("div#venkonten > div.download"))
                .map(ret =>{
                    return {
                        ep: Array.from(ret.querySelectorAll("h4"))
                            .map(has =>{
                                return {
                                    jud: has.textContent,
                                    cont: Array.from(has.nextElementSibling.querySelectorAll("li"))
                                        .map(das =>{
                                            return{
                                                kualitas: das.querySelector("strong").textContent,
                                                link: Array.from(das.querySelectorAll("a"))
                                                    .map(x =>{
                                                        return{
                                                            via: x.textContent,
                                                            link: x.getAttribute("href")
                                                        }
                                                    }),
                                                size: das.querySelector("i").textContent
                                            }
                                        })
                                }
                            })
                    }
                })
            }
            resolve({status: true, data})
        }catch(err){
            reject({status: false, error: err.message})
        }
    }),

    getAnimeList: () => new Promise(async (resolve, reject)=>{
        try{
            const has = await getData(`${website}/anime-list`)
            let vid = has.querySelector("div#abtext")
    
            let data = Array.from(vid.querySelectorAll("div.bariskelom"))
                    .map(res =>{
                        return {
                            head: res.querySelector("div.barispenz a").textContent,
                            isi: Array.from(res.querySelectorAll("div.penzbar"))
                            .filter(x => x.querySelector("div.jdlbar"))
                            .map(x =>{
                                return {
                                    nama: x.querySelector("ul > li > a").textContent,
                                    href: x.querySelector("ul > li > a").getAttribute("href").replace(website, "")
                                }
                            })
                        }
                    })

            resolve({status: true, data})
        }catch(err){
            reject({status: false, error: err.message})
        }
    }),

    getGenreList: () => new Promise(async (resolve, reject) =>{
        try{
        const has = await getData(`${website}/genre-list`);

        let data = Array.from(has.querySelectorAll("ul.genres>li>a"))
            .map(res =>{
                return{
                    href: res.getAttribute("href").replace("/genres/","").slice(0,-1),
                    name: res.textContent
                }
            })

            resolve({status: true, data})
        } catch(err){
            reject({status: false, error: err.message})
        }
    }),

    getGenre: (genre, page) => new Promise(async (resolve, reject) =>{
        try{
            const has = await getData(`${website}/genres/${genre}/page/${page}/`)

            let data = {
                anim: Array.from(has.querySelectorAll("div#venkonten > div.vezone > div.venser > div.page > div"))
                    .filter(res => res.querySelector("div.col-anime"))
                    .map(res =>{
                        return {
                            title: res.querySelector("div.col-anime-title").textContent,
                            studio: res.querySelector("div.col-anime-studio").textContent,
                            eps: res.querySelector("div.col-anime-eps").textContent,
                            img: res.querySelector("div.col-anime-cover > img").getAttribute("src"),
                            rilis: res.querySelector("div.col-anime-date").textContent,
                            genre: res.querySelector("div.col-anime-genre").textContent,
                            sinopsis: res.querySelector("div.col-synopsis").textContent,
                            href: res.querySelector("div.col-anime-title > a").getAttribute("href").replace("https://otakudesu.bid/","")
                        }
                }),
                jmlPage: 0
            }

            Array.from(has.querySelector("div.pagination > div.pagipagi > div.pagenavix").children)
            .forEach(res =>{
                let max = parseInt(res.textContent)
                if(!isNaN(max)){
                    data.jmlPage = max
                }
            })

            resolve({status: true, data})
        } catch(err){
            reject({status: false, error: err.message})
        }
    }),

    searchAnim: (query) => new Promise(async (resolve, reject) =>{
        try{
            const has = await getData(`${website}/?s=${query}&post_type=anime`);
            
            const data = Array.from(has.querySelectorAll("ul.chivsrc > li"))
                .map(res =>{
                    return{
                        img: res.querySelector("img").getAttribute("src"),
                        href: res.querySelector("h2 > a").getAttribute("href").replace(website, ""),
                        judul: res.querySelector("h2 > a").textContent,
                        info: Array.from(res.querySelectorAll("div.set"))
                        .map(x => x.textContent)
                    }
                })

            resolve({status: true, data})
        }catch(err){
            reject({status: false, error: err.message})
        }
    })
}