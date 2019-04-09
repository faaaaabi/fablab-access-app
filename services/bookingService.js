// see https://github.com/facebook/react-native/issues/16434
import { URL, URLSearchParams } from "whatwg-url";
global.URL = URL;
global.URLSearchParams = URLSearchParams;

export const fetchDeviceBookings = async (positions, token, host) => {
  console.log("fetching bookings");
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  let url = new URL(`http://${host}/bookings/`);
  positions.forEach(device => {
    url.searchParams.append('deviceID', device.deviceID );
  });

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
  deviceID,
  userID,
  token,
  intermediateToken,
  host
) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const response = await fetch(`http://${host}/booking/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      deviceID: deviceID,
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
  booking,
  token,
  intermediateToken,
  host
) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  const response = await fetch(`http://${host}/booking/${booking._id}`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({
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
