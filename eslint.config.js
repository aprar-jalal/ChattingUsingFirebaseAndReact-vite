import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({

 plugins:[
  react()
 ],

 server:{
  host:"localhost",
  hmr:{
    clientPort:5173
  }
 }

});