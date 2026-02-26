import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function Artigos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    precoVista: "",
    precoPrazo: "",
    unidPreco: "KG",
    largura: "",
    rendimento: "",
    categoria: "Outros",
  });

  const { data: artigos = [], isLoading, refetch } = trpc.artigos.list.useQuery();
  const createMutation = trpc.artigos.create.useMutation({
    onSuccess: () => {
      toast.success("Artigo criado com sucesso!");
      refetch();
      setFormData({
        codigo: "",
        nome: "",
        precoVista: "",
        precoPrazo: "",
        unidPreco: "KG",
        largura: "",
        rendimento: "",
        categoria: "Outros",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar artigo: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo || !formData.nome) {
      toast.error("Código e nome são obrigatórios");
      return;
    }
    
    await createMutation.mutateAsync({
      codigo: formData.codigo,
      nome: formData.nome,
      precoVista: formData.precoVista ? parseFloat(formData.precoVista) : undefined,
      precoPrazo: formData.precoPrazo ? parseFloat(formData.precoPrazo) : undefined,
      unidPreco: formData.unidPreco,
      largura: formData.largura,
      rendimento: formData.rendimento,
      categoria: formData.categoria,
    });
  };

  const filteredArtigos = artigos.filter(artigo =>
    artigo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artigo.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Artigos</h1>
          <p className="text-gray-600">Cadastre e gerencie os artigos de tecido da Levy Têxtil</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Artigo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Artigo</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo artigo de tecido
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código *</Label>
                        <Input
                          id="codigo"
                          value={formData.codigo}
                          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                          placeholder="Ex: ART0001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nome">Nome do Artigo *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder="Ex: Algodão Cru"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precoVista">Preço à Vista</Label>
                        <Input
                          id="precoVista"
                          type="number"
                          step="0.01"
                          value={formData.precoVista}
                          onChange={(e) => setFormData({ ...formData, precoVista: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="precoPrazo">Preço a Prazo</Label>
                        <Input
                          id="precoPrazo"
                          type="number"
                          step="0.01"
                          value={formData.precoPrazo}
                          onChange={(e) => setFormData({ ...formData, precoPrazo: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="unidPreco">Unidade de Preço</Label>
                        <select
                          id="unidPreco"
                          value={formData.unidPreco}
                          onChange={(e) => setFormData({ ...formData, unidPreco: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="KG">KG</option>
                          <option value="MTS">MTS</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoria</Label>
                        <Input
                          id="categoria"
                          value={formData.categoria}
                          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                          placeholder="Ex: Tecido Plano"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="largura">Largura</Label>
                        <Input
                          id="largura"
                          value={formData.largura}
                          onChange={(e) => setFormData({ ...formData, largura: e.target.value })}
                          placeholder="Ex: 1,60 MTS"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rendimento">Rendimento</Label>
                        <Input
                          id="rendimento"
                          value={formData.rendimento}
                          onChange={(e) => setFormData({ ...formData, rendimento: e.target.value })}
                          placeholder="Ex: 2,80 MTS"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Salvando..." : "Salvar Artigo"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artigos Cadastrados</CardTitle>
            <CardDescription>{filteredArtigos.length} artigos no total</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando artigos...</p>
              </div>
            ) : filteredArtigos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum artigo cadastrado ainda</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                      <TableHead className="hidden md:table-cell">Preço Vista</TableHead>
                      <TableHead className="hidden md:table-cell">Preço Prazo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArtigos.map((artigo) => (
                      <TableRow key={artigo.id}>
                        <TableCell className="font-medium">{artigo.codigo}</TableCell>
                        <TableCell>{artigo.nome}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                          {artigo.categoria}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {artigo.precoVista ? `R$ ${parseFloat(artigo.precoVista).toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {artigo.precoPrazo ? `R$ ${parseFloat(artigo.precoPrazo).toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" className="text-blue-600">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
