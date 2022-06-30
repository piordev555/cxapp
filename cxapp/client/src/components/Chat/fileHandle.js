import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";

export async function doFileTransfer(hash, file) {
	return new Promise((resolve, reject) => {
		const storage = getStorage();

		const storageRef = ref(storage, hash + "/" + file.name);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			async (snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
				switch (snapshot.state) {
					case "paused":
						console.log("Upload is paused");
						break;
					case "running":
						console.log("Upload is running");
						break;
				}
			},
			(error) => {
				switch (error.code) {
					case "storage/unauthorized":
						break;
					case "storage/canceled":
						break;

					case "storage/unknown":
						break;
				}
			},
			async () => {
				var downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
				console.log(downloadURL);
				resolve(downloadURL);
			}
		);
	});
}
