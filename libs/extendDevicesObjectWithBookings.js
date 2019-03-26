const extractDeviceBookingByDeviceName = (bookings, deviceName) => {
   bookings.find(booking => {
      return booking.deviceName === deviceName;
   })
} 

export const extendDevicesObjectWithBookings = ( devices, bookings ) => {
   devices.forEach(device => {
           const deviceBooking = extractDeviceBookingByDeviceName(bookings, device.name);
           if(deviceBooking) {
              device.booking = {isBooked: true, userUID: deviceBooking.userUID, startTime: deviceBooking.startTime}
           }
   });
}