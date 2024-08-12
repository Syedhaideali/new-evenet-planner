import { auth, db, storage, onAuthStateChanged, signOut, getDoc, getDocs, doc, collection, updateDoc, arrayUnion, arrayRemove } from "./utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const login_link = document.getElementById("login_link");
const user_img = document.getElementById("user_img");
const event_card_container = document.getElementById("event_card_container");
const myevents_btn = document.getElementById("myevents_btn");
const create_event_btn = document.getElementById("create_event_btn");

getAllEvents();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in

        const uid = user.uid;
        login_link.style.display = 'none';
        user_img.style.display = 'inline-block';
        logout_btn.style.display = "inline-block"
        myevents_btn.style.display = "inline-block"
        create_event_btn.style.display = "inline-block"

        getUserInfo(uid);
    } else {
        // User is signed out
        login_link.style.display = 'inline-block';
        user_img.style.display = 'none';
        logout_btn.style.display = "none"
        myevents_btn.style.display = "none"
         create_event_btn.style.display = "none"
    }
});

logout_btn.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
});

async function getUserInfo(uid) {
    try {
        const userRef = doc(db, "IDs", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            user_img.src = userDoc.data().img;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting user info: ", error);
    }
}

async function getAllEvents() {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        event_card_container.innerHTML = '';
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);

            const event = doc.data();

            console.log("events =>", event);

            const { banner, title, location, createdByEmail, desc, time, date } = event;

            const card = `
                <div class="event-card">
                    <img class="rounded-t-lg" src="${banner}" alt="Event Image" />
                    <div class="p-5">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${title}</h5>
                        <p class="mb-3 font-normal text-gray-700">Time: ${date}, ${time}</p>
                        <p class="mb-3 font-normal text-gray-700">Creator: ${createdByEmail}</p>
                        <p class="mb-3 font-normal text-gray-700">Location: ${location}</p>
                        <button id="${doc.id}" 
                        onclick="likeEvent(this)" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                            ${auth?.currentUser && event?.likes?.includes(auth?.currentUser.uid)
                                 ? "Liked.." 
                                 : "Like"} ${event?.likes?.length ? event?.likes?.length: ""}
                        </button>
                    </div>
                </div>`;
            
            event_card_container.innerHTML += card;
        });
    } catch (error) {
        console.error("Error getting events: ", error);
    }
}

async function likeEvent(e) {
    if (auth.currentUser) {
        e.disabled = true
        const docRef = doc(db, 'events', e.id);
        try {
            const eventDoc = await getDoc(docRef);

            if (eventDoc.exists()) {
                const likes = eventDoc.data().likes || [];
                const userLiked = likes.includes(auth.currentUser.uid);

                if (userLiked) {
                    await updateDoc(docRef, {
                        likes: arrayRemove(auth.currentUser.uid)
                    });
                    e.innerText = "Like";
                    e.disabled = false
                } else {
                    await updateDoc(docRef, {
                        likes: arrayUnion(auth.currentUser.uid)
                    });
                    e.innerText = "Liked..";
                    e.disabled = false
                }
            } else {
                console.log("No such document!");
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        window.location.href = '/auth/login/index.html';
    }
}

window.likeEvent = likeEvent;
