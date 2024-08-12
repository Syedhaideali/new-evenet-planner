import {auth, 
    createUserWithEmailAndPassword,
    doc, 
    setDoc,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL
    } from "../../utils/utils.js";

    // 1. Create Account => createUserWithEmailAndPassword
    // 2. upload image => ref, uploadBytes, getDownloadURL
    // 3. Set complete data into firestore =>  doc, setDoc

        const signup_btn = document.getElementById("signup_form")
        const submit_btn = document.getElementById("submit_btn")

        signup_btn.addEventListener("submit", function(e){
            e.preventDefault();
            console.log(e);

            const img = e.target[0].files[0];
            const email = e.target[1].value;
            const password = e.target[2].value;
            const firstName = e.target[4].value;
            const lastName = e.target[5].value;
            const phone = e.target[6].value;
            const company = e.target[7].value;

            const userInfo = {
                img,
                email,
                password,
                firstName,
                lastName,
                phone,
                company
            };

            // account create hogya
            submit_btn.disabled = true
            submit_btn.innerText = "Loading..."

            createUserWithEmailAndPassword(auth, email, password).then((user) =>{
                console.log("user=>", user.user.uid); //acc create hone ke baad user ki uid mil gi

                // upload user image  // uid ke saath reference bna diya
                const userRef = ref(storage, `user/ ${user.user.uid}`)
                
                // ab user ki file store krni hai database ke ander img ki file
                uploadBytes(userRef , img).then(()=>{
                    console.log('user image uploading');

                    // getting url of the image we just uploaded
                    getDownloadURL(userRef).then((url)=>{
                        console.log(("url agya bhai =>", url));

                        // update user info object
                        userInfo.img = url
                        
                        // created user document reference
                        const userDbRef = doc(db, 'IDs', user.user.uid )

                        // set this document to db
                        setDoc(userDbRef, userInfo).then(() =>{
                            console.log('User Objected Updated into DB')
                            window.location.href = "/";

                             submit_btn.disabled = false
            submit_btn.innerText = "Submit"

                        }) 


                    }).catch((err)=> console.log('url firebase nhi de rha'))

                         submit_btn.disabled = true
                         submit_btn.innerText = "Submit"

                })
                .catch(()=>{
                    console.log("Error in uploading user image");
                });


            })
            .catch((err)=> {
                alert(err), (submit_btn.disabled = false);
                submit_btn.innerText = "submit";
                
            })

            console.log(userInfo);
        })