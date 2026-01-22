const BASE_URL = "https://saavn.sumit.co/api";

export async function searchSongs(query: string) {
  let correct_query = query === undefined || query === null || query === "" ?  "love":query.trim();
  const res = await fetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(correct_query)}`
  );
  const json = await res.json();
  return json.data.results;
}

const FALLBACK_ARTIST_IMAGE =
  "https://ui-avatars.com/api/?name=Artist&background=0D8ABC&color=fff";

export async function searchArtists(query: string) {
  let correct_query = query === undefined || query === null || query === "" ? "arijit":query.trim();
  const res = await fetch(
    `${BASE_URL}/search/artists?query=${encodeURIComponent(correct_query)}`
  );

  let json = await res.json();

  const normalized = json.data.results.map((artist: any) => {
    const realImage =
      artist.image?.find((i: any) => i.quality === "500x500")?.url ||
      artist.image?.find((i: any) => i.quality === "150x150")?.url ||
      null;

    return {
      ...artist,
      imageUrl: realImage ?? FALLBACK_ARTIST_IMAGE,
      hasRealImage: Boolean(realImage),
    };
  });

  return normalized.sort(
    (a: any, b: any) => Number(b.hasRealImage) - Number(a.hasRealImage)
  );
}

/* Albums */

const FALLBACK_ALBUM_IMAGE =
  "https://via.placeholder.com/300?text=Album";

export async function searchAlbums(query: string) {
  let correct_query = query === undefined || query === null || query === "" ? "popular":query.trim();
  const res = await fetch(
    `${BASE_URL}/search/albums?query=${encodeURIComponent(correct_query)}`
  );

  const json = await res.json();

  return json.data.results.map((album: any) => {
    const image =
      album.image?.find((i: any) => i.quality === "500x500")?.link ||
      album.image?.find((i: any) => i.quality === "150x150")?.link ||
      FALLBACK_ALBUM_IMAGE;

    return {
      ...album,
      imageUrl: image,
    };
  });
}