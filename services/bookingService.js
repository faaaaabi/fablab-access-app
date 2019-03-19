const isDeviceBooked = (deviceName, bookings) => {
  return bookings.some(booking => {
    return booking.deviceName === deviceName;
  });
};

const findBooking = (devicName, bookings) => {
  return bookings.find(booking => {
    return booking.deviceName === devicName;
  });
};

export const fetchDeviceBookings = async (devices, token, host) => {
  console.log("fetching bookings");
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  let url = new URL(`http://${host}/bookings/`);
  const devicesArray = [];
  devices.forEach(row => {
    row.forEach(element => {
      if (element) {
        devicesArray.push(element);
      }
    });
  });

  var params = {
    ids: devicesArray.map(device => {
      return device.name;
    })
  };

  url.search = new URLSearchParams(params);
  const response = await fetch(url, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    const responeJSON = await response.json();
    throw new Error(
      `There was an error booking this device. Error: ${responeJSON.error}`
    );
  }

  const deviceBookings = await response.json();
  return deviceBookings;
};

export const startBooking = async (
  deviceName,
  userID,
  token,
  intermediateToken,
  host
) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const response = await fetch(`http://${host}/bookings/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      deviceName: deviceName,
      userUID: userID,
      intermediateToken: intermediateToken
    })
  });
  if (!response.ok) {
    const responeJSON = await response.json();
    throw new Error(
      `There was an error booking this device. Error: ${responeJSON.error}`
    );
  } else {
    return true;
  }
};

export const endBooking = async (
  deviceName,
  userID,
  booking,
  token,
  intermediateToken,
  host
) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const response = await fetch(`http://${host}/bookings/`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({
      deviceName: deviceName,
      bookingID: booking._id,
      intermediateToken: intermediateToken
    })
  });
  if (!response.ok) {
    const responeJSON = await response.json();
    throw new Error(
      `There was an error booking this device. Error: ${responeJSON.error}`
    );
  } else {
    return true;
  }
};
