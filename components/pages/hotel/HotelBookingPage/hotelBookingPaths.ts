/** Canonical app routes under `app/(website)/hotels/details/[hotel_Id]/[uuid]/booking/` */
export function hotelBookingBasePath(hotelId: string, uuid: string) {
  return `/hotels/details/${hotelId}/${uuid}/booking`;
}

export function hotelBookingSuccessPath(hotelId: string, uuid: string) {
  return `${hotelBookingBasePath(hotelId, uuid)}/success`;
}

export function hotelBookingFailedPath(hotelId: string, uuid: string) {
  return `${hotelBookingBasePath(hotelId, uuid)}/failed`;
}
