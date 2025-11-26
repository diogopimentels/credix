"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const clients_routes_1 = require("./clients.routes");
const loans_routes_1 = require("./loans.routes");
const dashboard_routes_1 = require("./dashboard.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use('/login', auth_routes_1.authRoutes);
routes.use('/clientes', clients_routes_1.clientsRoutes);
routes.use('/emprestimos', loans_routes_1.loansRoutes);
routes.use('/dashboard', dashboard_routes_1.dashboardRoutes);
routes.use('/fechamento-mensal', dashboard_routes_1.dashboardRoutes);
// Alias for consistency with frontend if needed
routes.use('/clients', clients_routes_1.clientsRoutes);
routes.use('/loans', loans_routes_1.loansRoutes);
