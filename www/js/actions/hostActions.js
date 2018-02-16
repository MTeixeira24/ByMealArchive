import dispatcher from "../dispatcher.js";


export function updateHost(
	id,
	hostid,
	instructions,
	lat,
	lon,
	amenities,
	venue_type,
	venue_images,
	description,
	callback){
	dispatcher.dispatch({
		type: "UPDATE_HOST",
		id,
		hostid,
		instructions,
		lat,
		lon,
		amenities,
		venue_type,
		venue_images,
		description,
		callback
	});
}

export function onboard(email,
						description,
						features,
                        instructions,
						service_type,
						joining_reason,
						hosting_frequency,
						type_of_food,
						lat,
						lon,
						amenities,
						venue_type,
						venue_images){
  dispatcher.dispatch({
    type: "ONBOARD",
    email,
    description,
    instructions,
    service_type,
    joining_reason,
    hosting_frequency,
    type_of_food,
    lat,
    lon,
    amenities,
    venue_type,
    venue_images
  });
}

export function associateStripe(token, hostId){
	dispatcher.dispatch({
		type: "ASSOCIATE_STRIPE",
		token,
		hostId
	})
}

export function updatePicture(file, offsetX, offsetY){
	dispatcher.dispatch({
		type: "UPDATE_PICTURE",
		file,
		firstName,
		lastName
	})
}
