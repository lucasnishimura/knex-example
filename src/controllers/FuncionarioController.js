const connection = require('../../database/connection');
const filter = require('knex-filter').filter;
const CryptoJS = require('crypto-js');
const { format, parseISO } = require('date-fns');
const admin = require("firebase-admin");
const config = require("../../configFireBase.json")
const UUID = require("uuid-v4")
const { Storage } = require("@google-cloud/storage")

// firebaseApp.initializeApp(config)
admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": process.env.PROJECT_ID,
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtmoh12nMfa0tJ\nu+PvFkDgovOOUG1WQEuG40xNDKfSMENOP3JmC0sZYwdsx0VEFwVDPSAwNcBNci5W\nkf9vbG3tB5ou3Iuq9M+cHSLCXSfPyDmm99aIYC/X3aio10JPNNrhu9C9gvwK4kF9\nWxzdJb0UbLZyYvax2AvCESJcLoGoEEOpLTUZ2fBafY72sPA+ZL8V9Lgy7cKgaACN\nQVdu3rIxnzz9HInaImBAnIci5pQQaGdu4RTRreW8wLVsB0JYMCQNrCxImsm1vQEA\n2fU/BcjE0FVYZCXwQL5YKxcw8fp1MsvdaIELA/DBaS5lOYNY60H2udxl2ZDHH1Mo\n34QNU2b5AgMBAAECggEAAMdBwl7YMkqzBoxwRq5PsdIj4ROiPIdC721jIQX5Vftq\nadY7UegjY48/8BsVR+tfK4CBfZstbAt4LWIv23+IdKNv67LdxhvyjFgjGOz9qd7+\nHINdnl8+slXnlNjg5BBaxN/93Rj9E/gUuWuoUvjW2ARuwvoyR0ouhKW6r4rJK7Lj\nvtRJSU2lqyOzap3EAoZ5tUHml0atLW38afVzLOmbLXhjBlh7vfNJlSBM4Ao4VyzJ\n3M+h4Ff/1Io2soNmv2xB3wNo4KeROSMhWn7Wy+ENgKQqG4iWO+bV08+c3N3dp3+9\nCLyLryHqlS8LvNRP2TL3TpG3RHMotqHGBBvoThIROwKBgQDTfShR+M7BK2tb9NV2\nBnE+wZbKs/siYYP4pFqMGkplm3rbGFl2HvA200Dk8MyZ/X3peADyyXEKYhjcsR+6\nX++3G49Mb0+7R5iOnJ5VOBNiPP/Y6pPovLkj1xMFlQTJDBWX1arKkJkEMs7c17LK\n9PFKPToWNV/Ng1+6GZW/RuL/BwKBgQDSJCZ5fEqqEdpkGfK+8DtSGJeP1Bi17yzF\nTs9xtllEPjxYiwRYCUqsVYA5ftVAvGfF5ni6OuDKClFjD1Q1gAQNvpwrvHHu4ylk\nV5PNSXAblHJ3LJdgD5ptEn+YYRBQmkmbla8dtd1zONGQ05478ENKwJgqhzp0mW6W\nsY0TD5bp/wKBgCvQLO82dVbNcPNe+G34DbPrlRqvSKKpwxZariuCMtFz8XK8S6RN\n6oPhJfuH60snmdMpOkER/GojQnVN+H267EVp3zj9gm4Q+gjpZ1/OOy3J51L/3d6E\nYnKLVvR8F76y0zJeYICQjjKxd+uGgBLNxcMUhhkdu5gu1EEQldZHkDU3AoGAMnW9\ny2Q+JZJ955WXhaP4CqGfG0lp2Z4iGQrwozSPQOTU5soS8/TfOnyZerTrDk1vecT6\n7nUe70UFAA15QhOIZaiEpbftf9iKYu7ord3ZjrXZuqY5fzaf9VsAyp1cJo616CdM\nUo0OLRHSuL0n/OqXrgaLQ4MPVVpWhNcDsjUHHw8CgYAAg9MCDmuSIQgLIhWFxHGs\nH8tbDqGrT89zTCbWymznLf/jbBUvVoYDKrYbgqrctIkMK61Kn1Qezl695xH2AhoF\nQFFhPybJ38ISyWrZ6fvbf2rJkzeYgjfiuES13hxVh4vl1Celi1+4n83KCxTkaAo1\nEHARnuOCTJ4hpTGSiH7XoQ==\n-----END PRIVATE KEY-----\n",
      "client_email": process.env.CLIENT_EMAIL,
      "client_id": process.env.CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.CLIENT_CERT_URL,
      "universe_domain": "googleapis.com"
    })
});

const storage = new Storage({
    keyFilename: "configFireBase.json"
})

module.exports = {
  async index(req, res){
    try {  
      const [ count ] = await connection('funcionarios').count();
      const funcionarios  = await connection('funcionarios')
      .select([
          'funcionarios.*',
      ])
      .where(filter(req.query))
      .orderBy('nome', 'asc')
      
      res.header('X-Total-Count', count['count(*)']);
  
      return res.json(funcionarios);
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async create(req,res){
    try {  
      const { 
          nome,
          cpf,
          cargo,
          whatsapp,
          statusFunc,
          email,
          city,
          uf,
          endereco,
          salario,
          data_contratacao: dataContratacao,
		      data_nascimento: dataNascimento,
          imagem,
          senha: password
      }  = req.body;
      // const ongId = req.headers.Authorization;

      const senha = CryptoJS.AES.encrypt(password,process.env.PASSWORD_SECRET).toString()
      const data_contratacao = format(parseISO(dataContratacao), 'yyyy-MM-dd')
      const data_nascimento = format(parseISO(dataNascimento), 'yyyy-MM-dd')

      const uuid = UUID();
      const bucket = storage.bucket("gs://infra-engenharia.appspot.com");
      const downloadPath = "https://firebasestorage.googleapis.com/v0/b/infra-engenharia.appspot.com/o/"

      const imgResponse = await bucket.upload(req.file.path, {
        destination: `users/${req.file.filename}`,
        resumable: true,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      })
      
      const imgUrl = downloadPath +
      encodeURIComponent(imgResponse[0].name) +
      "?alt=media&token=" +
      uuid;

      const {id} = await connection('funcionarios').insert({
          nome,
          cpf,
          cargo,
          whatsapp,
          statusFunc,
          email,
          senha,
          city,
          uf,
          endereco,
          salario,
          data_contratacao,
          data_nascimento,
          imagem: imgUrl,
          senha
      });
      return res.json({ id })
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async delete(req, res){
    try {  
      const { id } = req.params;
      // const ongId = req.headers.Authorization;
  
      await connection('funcionarios').where('id', id).delete();
  
      return response.status(204).send();
    } catch (error) {
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  },

  async alter(req, res){
    try {  
      const { 
          id,
          nome,
          cpf,
          cargo,
          whatsapp,
          statusFunc,
          email,
          city,
          uf,
          endereco,
          salario,
          data_contratacao: dataContratacao,
		      data_nascimento: dataNascimento,
          imagem,
          senha: password
      }  = req.body;

      const senha = CryptoJS.AES.encrypt(password,process.env.PASSWORD_SECRET).toString()
      const data_contratacao = format(parseISO(dataContratacao), 'yyyy-MM-dd')
      const data_nascimento = format(parseISO(dataNascimento), 'yyyy-MM-dd')

      if(req.file){
        const uuid = UUID();
        const bucket = storage.bucket("gs://infra-engenharia.appspot.com");
        const downloadPath = "https://firebasestorage.googleapis.com/v0/b/infra-engenharia.appspot.com/o/"

        const imgResponse = await bucket.upload(req.file.path, {
          destination: `users/${req.file.filename}`,
          resumable: true,
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        })
        
        const imgUrl = downloadPath +
        encodeURIComponent(imgResponse[0].name) +
        "?alt=media&token=" +
        uuid;

        await connection('funcionarios')
        .update({
            nome,
            cpf,
            cargo,
            whatsapp,
            statusFunc,
            email,
            city,
            uf,
            endereco,
            salario,
            data_contratacao,
            data_nascimento,
            imagem: imgUrl,
            senha
        })
        .where('id', id);
      }else{
        await connection('funcionarios')
        .update({
            nome,
            cpf,
            cargo,
            whatsapp,
            statusFunc,
            email,
            city,
            uf,
            endereco,
            salario,
            data_contratacao,
            data_nascimento,
            senha
        })
        .where('id', id);
      }
  
      return res.status(200).send();    
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error, text: 'Erro interno no servidor'})
    }
  }
}