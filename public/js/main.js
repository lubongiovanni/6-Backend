const socket = io.connect();

const formProducts = document.getElementById('FormProducts');

formProducts.addEventListener('submit', (e) => {
    e.preventDefault();

    const product = {
        title: formProducts[0].value,
        price: formProducts[1].value,
        thumbnail: formProducts[2].value,
    }

    socket.emit('update', product);

    formProducts.reset();
});

socket.on('products', handleEventProducts);

async function handleEventProducts(products) {

    const remoteResource = await fetch('plantilla/table-products.hbs');

    const templateText = await remoteResource.text();

    const functionTemplate = Handlebars.compile(templateText);

    const html = functionTemplate({ products });

    document.getElementById('Products').innerHTML = html;
}

const btn = document.getElementById('btnSend');

btn.addEventListener('click', (e) => {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if(email == '') {
        alert('¡Ingrese su email!');
        document.getElementById('email').focus();
        return;
    }

    const bodyMessage = {
        email: email,
        date: new Date().toLocaleString(),
        message: message,
    }

    socket.emit('chat', bodyMessage);
});

socket.on('chat', messages =>{

    if(messages.length == 0) {
        document.getElementById('Messages').innerHTML = '¡No hay mensajes!';
    }else{
        const htmlMessages = messages.map(msj => `<span style='color: blue; font-weight: bold;'>${msj.email}</span> <span style='color: maroon'>[${msj.date}]:</span>  <span style='color: black; font-style: italic'>${msj.message}</span>`)
        .join('<br>')
        document.getElementById('Messages').innerHTML = htmlMessages;
    }
});