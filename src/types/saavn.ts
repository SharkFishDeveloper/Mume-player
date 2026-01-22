export interface Root {
  success: boolean
  data: Data
}

export interface Data {
  total: number
  start: number
  results: Result[]
}

export interface Result {
  id: string
  name: string
  type: string
  year: string
  releaseDate: any
  duration: number
  label: string
  explicitContent: boolean
  playCount: number
  language: string
  hasLyrics: boolean
  lyricsId: any
  url: string
  copyright: string
  album: Album
  artists: Artists
  image: Image3[]
  downloadUrl: DownloadUrl[]
}

export interface Album {
  id: string
  name: string
  url: string
}

export interface Artists {
  primary: Primary[]
  featured: Featured[]
  all: All[]
}

export interface Primary {
  id: string
  name: string
  role: string
  image: Image[]
  type: string
  url: string
}

export interface Image {
  quality: string
  url: string
}

export interface Featured {
  id: string
  name: string
  role: string
  image: any[]
  type: string
  url: string
}

export interface All {
  id: string
  name: string
  role: string
  image: Image2[]
  type: string
  url: string
}

export interface Image2 {
  quality: string
  url: string
}

export interface Image3 {
  quality: string
  url: string
}

export interface DownloadUrl {
  quality: string
  url: string
}

export default Result
