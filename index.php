<html>
<head>
    <title>Projeto-Base</title>
    <meta charset="utf-8">
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css" rel="stylesheet">
</head>
<body>
<div class="container">
    <nav class="span3" style="margin: 25px auto; display: block; float: none">
        <div class="page-header">
            <h1>Projeto-Base<br>
                <small>Páginas disponiveis</small>
            </h1>
        </div>
        <ul class="nav nav-tabs nav-stacked">
            <?php
            $arquivos = glob('*.{php}', GLOB_BRACE);
            foreach ($arquivos as $arq):
                echo (strstr($arq, 'inc.') || ($arq == 'index.php')) ? NULL : "<li> <a href='{$arq}' >{$arq}</a></li>";
            endforeach;?>
        </ul>
    </nav>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
</body>
</html>