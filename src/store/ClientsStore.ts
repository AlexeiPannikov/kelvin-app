import {ClientModel} from "../api/models/responses/Clients/ClientModel";
import ClientsService from "../api/services/ClientsService";
import FilesService from "../api/services/FilesService";
import {defineStore} from "pinia";

interface IState {
    isLoadingClients: boolean;
    isLoadingClient: boolean;
    isLoadingAddEditClient: boolean;
    isLoadingDeleteClient: boolean;
    clients: ClientModel[];
    client: ClientModel;
    selectedClientId: number
}

export const useClientsStore = defineStore("clients", {
    state: () => {
        return {
            isLoadingClients: false,
            isLoadingClient: false,
            isLoadingAddEditClient: false,
            isLoadingDeleteClient: false,
            clients: new Array<ClientModel>(),
            client: new ClientModel(),
            selectedClientId: null
        } as IState;
    },

    getters: {
        clientsSelectList(): { title: string, value: number }[] {
            if (!this.clients.length) return
            return this.clients.map(({id, name}) => ({title: name, value: id}))
        }
    },

    actions: {
        async getClients(): Promise<ClientModel[]> {
            this.isLoadingClients = true;
            try {
                const res = await ClientsService.getClients();
                if (res) {
                    this.clients = res.map(item => new ClientModel(item));
                    await FilesService.filesDownloader("avatar", this.clients.map(({avatar}) => avatar))
                    return this.clients;
                }
            } finally {
                this.isLoadingClients = false;
            }
        },

        async getClient(id: number): Promise<boolean> {
            this.isLoadingClient = true;
            try {
                const res = await ClientsService.getClient(id.toString());
                if (res) {
                    this.client = new ClientModel(res.client);
                    this.client.avatar_uuid = res.avatar?.uuid || "";
                    if (this.client.avatar_uuid) {
                        await FilesService.filesDownloader("avatar", this.client.avatar)
                    }
                    return true;
                }
            } finally {
                this.isLoadingClient = false;
            }
        },
    },
});
