import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, TrendingUp, Users, FileText, Clipboard } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Levy Têxtil</CardTitle>
            <CardDescription>Sistema de Gestão de Estoque</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">Faça login para acessar o sistema</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const isFuncionario = user?.role === "funcionario";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Levy Têxtil</h1>
          <p className="text-purple-100">Bem-vindo, {user?.name}!</p>
          <p className="text-sm text-purple-200 mt-1">Perfil: <span className="font-semibold capitalize">{user?.role}</span></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Total de Artigos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Cadastrados no sistema</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Entradas Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Movimentações de entrada</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 rotate-180" />
                Saídas Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Movimentações de saída</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1</div>
              <p className="text-xs text-gray-500 mt-1">Ativos no sistema</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                {isAdmin
                  ? "Acesse as principais funcionalidades de administração"
                  : "Acesse o módulo de romaneio"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isAdmin && (
                  <>
                    <Link href="/artigos">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Gerenciar Artigos
                      </Button>
                    </Link>
                    <Link href="/entrada">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Entrada
                      </Button>
                    </Link>
                    <Link href="/consulta">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Consultar Estoque
                      </Button>
                    </Link>
                    <Link href="/saida">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Saída
                      </Button>
                    </Link>
                  </>
                )}

                {isFuncionario && (
                  <>
                    <Link href="/romaneio">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Clipboard className="w-4 h-4 mr-2" />
                        Acessar Romaneio
                      </Button>
                    </Link>
                    <Link href="/consulta">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Consultar Estoque
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Usuário</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Perfil</p>
                <p className="font-medium capitalize">
                  {user?.role === "admin" ? "Administrador" : "Funcionário"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-xs break-all">{user?.email}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-gray-600 text-xs">
                  {isAdmin
                    ? "Você tem acesso a todas as funcionalidades do sistema"
                    : "Você tem acesso ao módulo de romaneio e consulta de estoque"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
