const API_URL = "http://localhost:8080/api/v1/chat";


// ===============================
// Lấy element
// ===============================
const chatBody = document.getElementById("chatBody");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const typing = document.getElementById("typing");



// ===============================
// Thêm tin nhắn BOT
// ===============================
function addBotMessage(text) {

    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";


    const avatar = document.createElement("img");
    avatar.src = "image.png";
    avatar.className = "avatar";
    avatar.alt = "Bot";


    const message = document.createElement("div");
    message.className = "message";


    message.textContent = text;



    botMessage.appendChild(avatar);
    botMessage.appendChild(message);


    chatBody.appendChild(botMessage);


    scrollBottom();

}



// ===============================
// Thêm tin nhắn USER
// ===============================
function addUserMessage(text) {


    const userMessage = document.createElement("div");
    userMessage.className = "user-message";


    const message = document.createElement("div");
    message.className = "message";


    message.textContent = text;



    userMessage.appendChild(message);


    chatBody.appendChild(userMessage);


    scrollBottom();

}




// ===============================
// Scroll cuối
// ===============================
function scrollBottom(){

    chatBody.scrollTop = chatBody.scrollHeight;

}





// ===============================
// Loading
// ===============================
function showTyping(){

    if(typing){

        typing.style.display = "flex";

    }

}



function hideTyping(){

    if(typing){

        typing.style.display = "none";

    }

}





// ===============================
// Gửi tin nhắn
// ===============================
async function sendMessage(){


    const message = messageInput.value.trim();



    if(message === ""){

        return;

    }



    addUserMessage(message);



    messageInput.value = "";



    showTyping();



    try {


        const response = await fetch(API_URL, {


            method:"POST",


            headers:{


                "Content-Type":"application/json"

            },


            body: JSON.stringify({

                message: message

            })


        });



        const result = await response.json();



        console.log(
            "========== BE RESPONSE =========="
        );


        console.log(
            JSON.stringify(result,null,2)
        );


        console.log(
            "================================="
        );



        hideTyping();




        // ===============================
        // Nhận dữ liệu từ ChatResponse
        // ===============================


        let botText = "";



        if(typeof result === "string"){


            botText = result;


        }

        else if(result.message){


            botText = result.message;


        }

        else if(result.data){


            botText = result.data;


        }

        else if(result.response){


            botText = result.response;


        }

        else if(result.answer){


            botText = result.answer;


        }

        else if(result.result){


            botText = result.result;


        }




        if(botText !== ""){


            addBotMessage(botText);


        }

        else{


            addBotMessage(
                "❌ BE không trả về nội dung."
            );


        }




    }
    catch(error){


        console.error(
            "ERROR:",
            error
        );



        hideTyping();



        addBotMessage(
            "❌ Không kết nối được Spring Boot."
        );


    }


}





// ===============================
// Click gửi
// ===============================
sendButton.addEventListener(
    "click",
    sendMessage
);





// ===============================
// Enter gửi
// ===============================
messageInput.addEventListener(
    "keydown",
    function(e){


        if(e.key === "Enter"){

            sendMessage();

        }


    }
);