export interface Bike {
  _id: string;
  _createdOn: string;
  // bike data model
  serial_number: string;
  location: {
    type: "Point";
    coordinates: number[]; // longitude, lattitude
  };
  in_order: boolean;
  service_status: number;
  battery_level: number; // from 0 to 100%
}
