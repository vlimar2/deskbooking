1- Funcionalidade: Registro de Usuário
User Story:
Como um novo usuário,
Eu quero me registrar na aplicação,
Para que eu possa fazer login e fazer reservas de mesa.

Regras de negócio:
* O e-mail do usuário deve ser único no sistema.
* O campo de senha deve ter, no mínimo, 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.
* Todos os campos obrigatórios (nome, e-mail, senha) devem ser preenchidos.
* O sistema deve validar o formato do e-mail antes do cadastro.

2- Funcionalidade: Login de Usuário
User Story:
Como um usuário registrado,
Eu quero fazer login na aplicação,
Para que eu possa acessar minha conta e fazer minhas reservas.

Regras de negócio:
* O login só é permitido com e-mail e senha válidos.
* O usuário deve permanecer autenticado por um período configurável (ex: 30 minutos de inatividade).

3- Funcionalidade: Reserva de Mesa
User Story:
Como um usuário autenticado,
Eu quero reservar uma mesa,
Para que eu garanta meu lugar em um dia e horário específicos.

Regras de negócio:
* Não pode haver duplicidade de reserva para a mesma mesa e horário.
* O sistema deve validar a disponibilidade da mesa antes de confirmar a reserva.
* Cada usuário pode ter no máximo uma reserva ativa por data.
* A reserva deve conter data, hora e mesa selecionada.
