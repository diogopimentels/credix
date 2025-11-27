import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function useProductTour() {
    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: false,
            doneBtnText: "Concluir",
            nextBtnText: "Próximo",
            prevBtnText: "Anterior",
            steps: [
                {
                    element: "#tour-step-1",
                    popover: {
                        title: "Total Emprestado",
                        description: "Acompanhe aqui o volume total da sua carteira de empréstimos em tempo real.",
                        side: "bottom",
                        align: "start"
                    }
                },
                {
                    element: "#tour-step-2",
                    popover: {
                        title: "Novo Empréstimo",
                        description: "Registre novos empréstimos rapidamente por aqui.",
                        side: "bottom",
                        align: "start"
                    }
                },
                {
                    element: "#tour-clients",
                    popover: {
                        title: "Gestão de Clientes",
                        description: "Cadastre e gerencie sua base de clientes aqui.",
                        side: "top",
                        align: "center"
                    }
                },
                {
                    element: "#tour-loans",
                    popover: {
                        title: "Controle de Empréstimos",
                        description: "Visualize todos os contratos ativos e histórico.",
                        side: "top",
                        align: "center"
                    }
                },
                {
                    element: "#tour-menu",
                    popover: {
                        title: "Menu e Configurações",
                        description: "Acesse o menu para configurações extras e para a opção de Resetar Demo.",
                        side: "top",
                        align: "end"
                    }
                }
            ],
            popoverClass: "driverjs-theme",
            onDestroyed: () => {
                // Optional: Save tour completion state if needed
            }
        });

        driverObj.drive();
    };

    return { startTour };
}
