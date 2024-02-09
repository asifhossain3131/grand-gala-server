const express=require('express')
const cors=require('cors')
require('dotenv').config()
import {Request,Response} from 'express'
import { ObjectId } from 'mongodb';
const { MongoClient, ServerApiVersion } = require('mongodb');


const app=express()
const port=process.env.PORT||5000

// middlewares
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_KEY}@cluster0.t31jaog.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
     // Connect the client to the server	(optional starting in v4.7)
    //  await client.connect();
  try {
     const database=client.db('grandGala')
     const allServiesCollection=database.collection('allServices')
     const allEventsCollection=database.collection('allEvents')

    
    //  service related 
     app.get('/allServices', async (req: Request, res: Response) => {
        try {
          const result = await allServiesCollection.find().toArray();
          res.status(200).send({ success: true, data: result });
        } catch (error) {
          console.error(error);
          res.status(500).send({ success: false, error: 'Internal Server Error' });
        }
      })
      
      app.get('/allServices/:serviceId',async(req:Request,res:Response)=>{
        try {
          const {serviceId}=req.params
          const result=await allServiesCollection.findOne({_id: new ObjectId(serviceId)})
          res.status(200).send({success:true,message:'data found successfully',data:result})
        } catch (error) {
          console.log(error)
        }
      })

      app.post('/allServices',async(req:Request,res:Response)=>{
        try {
            const serviceDetails=req.body
            const result=await allServiesCollection.insertOne(serviceDetails)
            res.status(200).send({success:true,message:'successfully inserted data'})
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
        }
      })

      app.put('/allServices',async(req:Request,res:Response)=>{
        try {
            const {serviceId,serviceTitle,serviceImg,providedServices,serviceDescription}=req.body
            const result=await allServiesCollection.updateOne({_id:new ObjectId(serviceId)},{
                $set:{
                    service_title:serviceTitle,
                    service_img:serviceImg,
                    services_in_array:providedServices,
                    service_description:serviceDescription
                }
            },{upsert:true})
            res.status(200).send({success:true,message:'successfully updated data'})
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
        }
      })

      app.delete('/allServices',async(req:Request,res:Response)=>{
        try {
            const {serviceId}=req.body
            const result=await allServiesCollection.deleteOne({_id:new ObjectId(serviceId)})
            res.status(200).send({success:true,message:'successfully deleted data'})
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
        }
      })

      
    //   events related 
      app.get('/allEvents/:status',async(req:Request,res:Response)=>{
        const {status}=req.params
        try {
            const result = await allEventsCollection.find({status:status}).toArray();
            res.status(200).send({ success: true, data: result });
          } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
          }
    })

    app.post('/allEvents',async(req:Request,res:Response)=>{
        const eventInfo=req.body
        try {
            const result = await allEventsCollection.insertOne(eventInfo)
            res.status(200).send({ success: true, data: result });
          } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
          }
    })

    app.put('/allEvents',async(req:Request,res:Response)=>{
        try {
            const {eventId,eventName,eventImg,eventPlace,eventDes,eventStatus,eventDate}=req.body
            const result=await allEventsCollection.updateOne({_id:new ObjectId(eventId)},{
                $set:{
                    event_name:eventName,
                    img:eventImg,
                    place:eventPlace,
                    description:eventDes,
                    status:eventStatus,
                    date:eventDate
                }
            },{upsert:true})
            res.status(200).send({success:true,message:'successfully updated data'})
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
        }
    })
      
    app.delete('/allEvents',async(req:Request,res:Response)=>{
        try {
            const {eventId}=req.body
            const result=await allEventsCollection.deleteOne({_id:new ObjectId(eventId)})
            res.status(200).send({success:true,message:'successfully deleted data'})
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: 'Internal Server Error' });
        }
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req:Request,res:Response)=>{
    res.send('gala grand server is running')
})


app.listen(port)


