export default function getImage(item: any) {
  if (!item?.image?.length) return undefined;

  return (
    item.image.find((i: any) => i.quality === "500x500")?.link ||
    item.image.find((i: any) => i.quality === "500x500")?.url ||
    item.image[0]?.link ||
    item.image[0]?.url
  );
}