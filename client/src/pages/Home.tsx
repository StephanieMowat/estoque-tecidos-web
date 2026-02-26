import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Package, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 md:p-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Levy Têxtil</h1>
            <p className="text-xl text-purple-100 mb-8">Sistema de Gestão de Estoque Online</p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50">
                Acessar Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Levy Têxtil</h1>
          <p className="text-xl text-purple-100 mb-8">Sistema de Gestão de Estoque Online</p>
          <p className="text-purple-100 max-w-2xl mb-8">
            Controle completo do seu estoque de tecidos com acesso de qualquer lugar, em qualquer dispositivo.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50">
              Fazer Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Funcionalidades Principais</h2>
          <p className="text-gray-600 text-lg">Tudo que você precisa para gerenciar seu estoque</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Gestão de Artigos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cadastre e organize todos os seus artigos de tecido com categorias, preços e especificações
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Controle de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Registre entradas e saídas em tempo real com rastreamento completo de movimentações
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gere relatórios em PDF com tabelas de preços e histórico completo de movimentações
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-red-600 mb-2" />
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Controle de acesso por perfil de usuário com autenticação segura e backup automático
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white rounded-lg p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Pronto para começar?</h3>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Acesse o sistema agora e comece a gerenciar seu estoque de forma profissional e eficiente.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50">
              Fazer Login Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 Levy Têxtil. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
