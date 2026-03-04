
/*

 - DEFINE ENDPOINTS
 - RECEBE AS REQUISIÇÕES;
 - CHAMA CAMADA RESPONSÁVEL POR APLICAR A LOGICA DE NEGÓCIO (SERVICE)
 - DEVOLVE UMA RESPOSTA PARA O CLIENTE;


 EXEMPLO DO HOSPITAL:
 Controller é a atendente do hospital, tem responsabilidade de receber as solicitacoes dos clientes e direcionar para os serviços adequados

 Mulher chega com seu filho no hospital -> ela quer consumir o serviço de pediatria

 A atendente (que seria o controller) -> faz perguntas (validacoes) e coleta todas informações iniciais necessarias e encaminha para o 
 doutor especialista no serviço desejado (no caso, o service de pediatria)

 depois disso a atendente sai de cena

 volta no fim do ciclo para dar tchau (feedback de resposta)

*/

