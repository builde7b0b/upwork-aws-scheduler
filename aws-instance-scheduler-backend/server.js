const express = require('express'); 
const bodyParser = require('body-parser');
const { exec } = require('child_process'); 
const cors = require('cors'); // Import the cors package


const app = express(); 
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
const region = 'us-east-1'; // Replace with your desired region


app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email === 'test@email.com' && password === 'password') {
        const token = 'dummy-jwt-token'; // Replace with a real JWT token generation in a real app

        res.status(200).send({
            token
        });
    }
    res.status(401).send('Invalid login');
});

app.post('/api/start-instance', (req, res) => {
    const instanceId = req.body.instanceId;
    if (!/^[a-zA-Z0-9-]+$/.test(instanceId)) {
        return res.status(400).send('Invalid instance ID');
    }
    
    exec(`aws ec2 start-instances --instance-ids ${instanceId} --region ${region}`, (err, stdout, stderr) => {
        if (err) {
        console.error(err);
        return res.status(500).send('Error starting instance');
        }
        console.log(stdout);
        console.error(stderr); 
        res.status(200).send('Instance started');
    });
});

app.post('/api/stop-instance', (req, res) => {
    
    const instanceId = req.body.instanceId;
    if (!/^[a-zA-Z0-9-]+$/.test(instanceId)) {
        return res.status(400).send('Invalid instance ID');
    }
    
    exec(`aws ec2 stop-instances --instance-ids ${instanceId} --region ${region}`, (err, stdout, stderr) => {
        if (err) {
        console.error(err);
        return res.status(500).send('Error stopping instance');
        }
        console.log(stdout);
        console.error(stderr); 
        res.status(200).send('Instance stopped');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});